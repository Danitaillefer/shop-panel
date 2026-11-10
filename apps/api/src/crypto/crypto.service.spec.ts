import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  const key = randomBytes(32).toString('base64');
  const config = { getOrThrow: () => key } as unknown as ConfigService;
  const service = new CryptoService(config);

  it('descifra lo que ha cifrado', () => {
    const token = 'shpat_1234567890abcdef';
    expect(service.decrypt(service.encrypt(token))).toBe(token);
  });

  it('nunca guarda el token en claro', () => {
    expect(service.encrypt('shpat_secreto')).not.toContain('shpat_secreto');
  });

  it('cifra distinto cada vez (IV aleatorio)', () => {
    expect(service.encrypt('mismo-token')).not.toBe(service.encrypt('mismo-token'));
  });

  it('falla si el texto cifrado ha sido manipulado', () => {
    const [iv, tag, data] = service.encrypt('token').split(':');
    const tampered = [iv, tag, Buffer.from('otra-cosa').toString('base64')].join(':');
    expect(() => service.decrypt(tampered)).toThrow();
  });

  it('no arranca con una clave de tamaño incorrecto', () => {
    const badConfig = { getOrThrow: () => 'corta' } as unknown as ConfigService;
    expect(() => new CryptoService(badConfig)).toThrow();
  });
});