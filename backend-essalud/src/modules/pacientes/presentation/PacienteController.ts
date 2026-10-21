import { Request, Response } from 'express';
import { PacienteService } from '../application/PacienteService';
import bcrypt from 'bcryptjs';

export class PacientesController {
  constructor(private pacienteService: PacienteService) {}

  crearPaciente = async (req: Request, res: Response): Promise<void> => {
    try {
      const rolEjecutor = (req as any).user?.id_rol;

      if (!rolEjecutor) {
        res.status(401).json({ error: 'No se pudo identificar la identidad o el rol del usuario.' });
        return;
      }

      const dto = req.body;
      await this.pacienteService.ejecutar(dto, rolEjecutor);
      
      res.status(201).json({ mensaje: 'Paciente registrado exitosamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  listarPacientes = async (req: Request, res: Response): Promise<void> => {
    try {
      const usuarioAutenticado = (req as any).user;
      if (!usuarioAutenticado) {
        res.status(401).json({ error: 'Acceso denegado: Se requiere un token de autenticación válido.' });
        return;
      }

      const pacientes = await this.pacienteService.listarPacientes();
      
      const jsonResponse = pacientes.map(paciente => ({
        dni: paciente.dni,
        nombre: paciente.nombre,
        apellidos: paciente.apellidos,
        fec_nac: (paciente as any).fechaNacimiento || (paciente as any).fec_nac,
        sexo: paciente.sexo,
        telefono: paciente.telefono,
        tipo_seguro: paciente.tipoSeguro,
        grupo_sanguineo: paciente.grupoSanguineo
      }));

      res.status(200).json(jsonResponse);
    } catch (error: any) {
      res.status(500).json({ error: 'Error interno al obtener la lista de pacientes: ' + error.message });
    }
  };

  buscarPorDni = async (req: Request, res: Response): Promise<void> => {
    try {
      const usuarioAutenticado = (req as any).user;
      if (!usuarioAutenticado) {
        res.status(401).json({ error: 'Acceso denegado: Se requiere un token de autenticación válido.' });
        return;
      }

      const dni = req.params.dni as string;
      const pacientes = await this.pacienteService.buscarPorDni(dni);

      const jsonResponse = pacientes.map(paciente => ({
        dni: paciente.dni,
        nombre: paciente.nombre,
        apellidos: paciente.apellidos,
        fec_nac: (paciente as any).fechaNacimiento || (paciente as any).fec_nac,
        sexo: paciente.sexo,
        telefono: paciente.telefono,
        tipo_seguro: paciente.tipoSeguro,
        grupo_sanguineo: paciente.grupoSanguineo
      }));

      res.status(200).json({ ok: true, data: jsonResponse });
    } catch (error: any) {
      res.status(400).json({ ok: false, error: error.message });
    }
  };

  actualizarPaciente = async (req: Request, res: Response): Promise<void> => {
    try {
      const dni = req.params.dni as string;
      const { passwordOperador, ...dto } = req.body; 

      const usuarioOperador = (req as any).user; 
      if (!usuarioOperador || !passwordOperador) {
        res.status(400).json({ error: 'La contraseña de confirmación del operador es obligatoria.' });
        return;
      }

      const hashOperador = usuarioOperador.password || usuarioOperador.passwordHash;

      if (hashOperador) {
        const esValido = await bcrypt.compare(passwordOperador, hashOperador);
        if (!esValido) {
          res.status(403).json({ error: 'Contraseña de confirmación incorrecta. Operación cancelada por seguridad.' });
          return;
        }
      }

      await this.pacienteService.actualizarPaciente(dni, dto);
      res.status(200).json({ mensaje: 'Datos del paciente actualizados correctamente' });

    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  eliminarPaciente = async (req: Request, res: Response): Promise<void> => {
    try {
      const dni = req.params.dni as string;
      const { passwordOperador } = req.body; 

      const usuarioOperador = (req as any).user; 
      if (!usuarioOperador || !passwordOperador) {
        res.status(400).json({ error: 'Se requiere su contraseña personal para autorizar la eliminación.' });
        return;
      }

      const hashOperador = usuarioOperador.password || usuarioOperador.passwordHash;

      if (hashOperador) {
        const esValido = await bcrypt.compare(passwordOperador, hashOperador);
        if (!esValido) {
          res.status(403).json({ error: 'Contraseña de confirmación incorrecta. No se pudo eliminar al paciente.' });
          return;
        }
      }

      await this.pacienteService.eliminarPaciente(dni);
      res.status(200).json({ mensaje: 'Paciente eliminado exitosamente del sistema' });

    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}