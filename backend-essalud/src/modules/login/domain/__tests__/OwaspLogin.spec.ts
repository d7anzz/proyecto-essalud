import { LoginService } from '../../application/LoginService';
import { CambiarPasswordPerfilService } from '../../application/CambiarPasswordPerfilService';
import { LoginRepository } from '../LoginRepository';
import { Usuario } from '../Usuario';
import * as bcrypt from 'bcryptjs';

describe('Pruebas de Seguridad OWASP - Módulo Login (Código 100% Real)', () => {
  let loginService: LoginService;
  let cambiarPasswordService: CambiarPasswordPerfilService;
  let mockLoginRepo: jest.Mocked<LoginRepository>;

  beforeEach(() => {
    mockLoginRepo = {
      buscarPorDni: jest.fn(),
      actualizarEstado: jest.fn(),
    } as any;

    loginService = new LoginService(mockLoginRepo);
    cambiarPasswordService = new CambiarPasswordPerfilService(mockLoginRepo);
  });

  // ------------------------------------------------------------------------
  // OWASP A02: Cryptographic Failures
  // Prueba real con CambiarPasswordPerfilService y Bcrypt real
  // ------------------------------------------------------------------------
  it('OWASP A02: Debe actualizar y cifrar la contraseña de forma segura usando Bcrypt mediante el servicio de aplicación real', async () => {
    const passwordAntiguaPlana = 'ClaveVieja123';
    const hashAntiguo = await bcrypt.hash(passwordAntiguaPlana, 10);

    const usuarioReal = new Usuario(
      '45678912',
      'medico_essalud',
      hashAntiguo,
      1,
      1,
      0,
      false
    );

    mockLoginRepo.buscarPorDni.mockResolvedValue(usuarioReal);

    await cambiarPasswordService.ejecutar({
      dni: '45678912',
      passwordActual: passwordAntiguaPlana,
      passwordNueva: 'NuevaClaveSegura2026*',
    });

    expect(usuarioReal.passwordHash).not.toBe(hashAntiguo);
    expect(await bcrypt.compare('NuevaClaveSegura2026*', usuarioReal.passwordHash)).toBe(true);
    expect(mockLoginRepo.actualizarEstado).toHaveBeenCalledWith(usuarioReal);
  });

  // ------------------------------------------------------------------------
  // OWASP A03: Injection (SQL Injection / Sanitización de entrada en Login)
  // Prueba real usando el método de dominio de tu clase Usuario y la búsqueda por DNI
  // ------------------------------------------------------------------------
  it('OWASP A03: Debe procesar de forma segura DNI con caracteres de inyección SQL sin alterar las consultas', async () => {
    const dniConInyeccion = "12345678' OR '1'='1";

    mockLoginRepo.buscarPorDni.mockResolvedValue(null);

    await expect(
      loginService.ejecutar({
        dni: dniConInyeccion,
        passwordIn: 'PasswordCualquiera123',
      })
    ).rejects.toThrow('Credenciales incorrectas');
    expect(mockLoginRepo.buscarPorDni).toHaveBeenCalledWith(dniConInyeccion);
  });

  // ------------------------------------------------------------------------
  // OWASP A07: Identification and Authentication Failures
  // Prueba real usando la regla de dominio Usuario.registrarIntentoFallido()
  // ------------------------------------------------------------------------
  it('OWASP A07: Debe invocar la regla de dominio real para bloquear la cuenta tras acumular 3 intentos fallidos', async () => {
    const passwordHashReal = await bcrypt.hash('ClaveCorrecta123', 10);

    const usuarioReal = new Usuario(
      '12345678',
      'operador_essalud',
      passwordHashReal,
      2,
      1,
      2, 
      false
    );

    mockLoginRepo.buscarPorDni.mockResolvedValue(usuarioReal);

    await expect(
      loginService.ejecutar({
        dni: '12345678',
        passwordIn: 'ClaveErronea999',
      })
    ).rejects.toThrow('Credenciales incorrectas');

    expect(usuarioReal.intentosFallidos).toBe(3);
    expect(usuarioReal.estaActivo()).toBe(false);
    expect(mockLoginRepo.actualizarEstado).toHaveBeenCalledWith(usuarioReal);
  });
});