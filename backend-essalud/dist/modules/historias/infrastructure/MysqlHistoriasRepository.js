"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlHistoriasRepository = void 0;
class MysqlHistoriasRepository {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async obtenerHistoriaPorDni(dniPaciente) {
        const pacientes = await this.dataSource.query(`
      SELECT 
        dni,
        nombre,
        apellidos,
        fec_nac AS fecNac
      FROM pacientes
      WHERE dni = ?
      `, [dniPaciente]);
        if (!pacientes || pacientes.length === 0) {
            return null;
        }
        const paciente = pacientes[0];
        const consultasRows = await this.dataSource.query(`
      SELECT
        cm.id_consulta AS idConsulta,
        cm.id_cita AS idCita,
        cm.diagnostico AS diagnostico,
        cm.observaciones AS observaciones,
        cm.fecha_atencion AS fechaAtencion,
        c.estado AS estadoCita,
        ps.dni AS dniMedico,
        ps.nombre AS nombreMedico,
        ps.apellidos AS apellidosMedico,
        e.nombre_especialidad AS especialidad
      FROM consultas_medicas cm
      INNER JOIN citas_medicas c 
        ON cm.id_cita = c.id_cita
      INNER JOIN personal_salud ps 
        ON cm.id_medico = ps.dni
      LEFT JOIN especialidades e 
        ON ps.id_especialidad = e.id_especialidad
      WHERE cm.dni_paciente = ?
      ORDER BY cm.fecha_atencion DESC
      `, [dniPaciente]);
        const medicamentosRows = await this.dataSource.query(`
      SELECT
        cm.id_consulta AS idConsulta,
        m.id_medicamento AS idMedicamento,
        m.nombre_medicamento AS nombreMedicamento,
        m.composicion AS composicion,
        om.cantidad_recetada AS cantidadRecetada,
        om.cantidad_entregada AS cantidadEntregada,
        om.estado_entrega AS estadoEntrega
      FROM consultas_medicas cm
      INNER JOIN ordenes_medicamentos om
        ON cm.id_consulta = om.id_consulta
      INNER JOIN medicamentos m
        ON om.id_medicamento = m.id_medicamento
      WHERE cm.dni_paciente = ?
      `, [dniPaciente]);
        const medicamentosPorConsulta = new Map();
        for (const row of medicamentosRows) {
            const idConsulta = Number(row.idConsulta);
            if (!medicamentosPorConsulta.has(idConsulta)) {
                medicamentosPorConsulta.set(idConsulta, []);
            }
            medicamentosPorConsulta.get(idConsulta)?.push({
                idMedicamento: Number(row.idMedicamento),
                nombreMedicamento: row.nombreMedicamento,
                composicion: row.composicion,
                cantidadRecetada: Number(row.cantidadRecetada),
                cantidadEntregada: Number(row.cantidadEntregada),
                estadoEntrega: row.estadoEntrega
            });
        }
        const consultas = consultasRows.map((row) => ({
            idConsulta: Number(row.idConsulta),
            idCita: Number(row.idCita),
            fechaAtencion: row.fechaAtencion,
            estadoCita: row.estadoCita,
            medico: {
                dni: row.dniMedico,
                nombre: row.nombreMedico,
                apellidos: row.apellidosMedico,
                especialidad: row.especialidad
            },
            diagnostico: row.diagnostico,
            observaciones: row.observaciones,
            medicamentos: medicamentosPorConsulta.get(Number(row.idConsulta)) || []
        }));
        return {
            paciente: {
                dni: paciente.dni,
                nombre: paciente.nombre,
                apellidos: paciente.apellidos,
                fecNac: paciente.fecNac
            },
            consultas
        };
    }
}
exports.MysqlHistoriasRepository = MysqlHistoriasRepository;
//# sourceMappingURL=MysqlHistoriasRepository.js.map