import type { ValorUsuario, ValorUsuarioCreateInput } from '../../Domain/Entities/ValorUsuario';
import type { IFacturaCasaRepository } from '../../Domain/Ports/IFacturaCasaRepository';
import type { IUsuarioRepository } from '../../Domain/Ports/IUsuarioRepository';
import type { IValorUsuarioRepository } from '../../Domain/Ports/IValorUsuarioRepository';

function assertConsumoLuz(consumoLuz: number) {
  if (!Number.isFinite(consumoLuz) || consumoLuz < 0) {
    throw new Error('El consumo de luz debe ser un número mayor o igual a 0.');
  }
}

function valorAseoParaUsuario(esCasa: boolean): number | null {
  return esCasa ? null : 0;
}

export class CreateValorUsuarioUseCase {
  constructor(
    private readonly valorUsuarioRepository: IValorUsuarioRepository,
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly facturaCasaRepository: IFacturaCasaRepository,
  ) {}

  async execute(input: Pick<ValorUsuarioCreateInput, 'idFacturaCasa' | 'idUsuario' | 'consumoLuz'>): Promise<ValorUsuario> {
    assertConsumoLuz(input.consumoLuz);
    const factura = await this.facturaCasaRepository.findById(input.idFacturaCasa);
    if (!factura) {
      throw new Error('La factura no existe.');
    }
    const usuario = await this.usuarioRepository.findById(input.idUsuario);
    if (!usuario) {
      throw new Error('El usuario no existe.');
    }
    if (!usuario.activo) {
      throw new Error('Solo se pueden registrar consumos para usuarios activos.');
    }
    const duplicado = await this.valorUsuarioRepository.findByFacturaAndUsuario(
      input.idFacturaCasa,
      input.idUsuario,
    );
    if (duplicado) {
      throw new Error('Ya existe un registro para este usuario en esta factura. Usa editar.');
    }
    const row: ValorUsuarioCreateInput = {
      idFacturaCasa: input.idFacturaCasa,
      idUsuario: input.idUsuario,
      consumoLuz: input.consumoLuz,
      valorAseo: valorAseoParaUsuario(usuario.esCasa),
    };
    return this.valorUsuarioRepository.create(row);
  }
}

export class GetValoresUsuarioByFacturaUseCase {
  constructor(private readonly valorUsuarioRepository: IValorUsuarioRepository) {}

  execute(idFacturaCasa: number): Promise<ValorUsuario[]> {
    return this.valorUsuarioRepository.findAllByFacturaId(idFacturaCasa);
  }
}

export class GetValorUsuarioByFacturaUsuarioUseCase {
  constructor(private readonly valorUsuarioRepository: IValorUsuarioRepository) {}

  execute(idFacturaCasa: number, idUsuario: number): Promise<ValorUsuario | null> {
    return this.valorUsuarioRepository.findByFacturaAndUsuario(idFacturaCasa, idUsuario);
  }
}

export class GetValorUsuarioByIdUseCase {
  constructor(private readonly valorUsuarioRepository: IValorUsuarioRepository) {}

  execute(id: number): Promise<ValorUsuario | null> {
    return this.valorUsuarioRepository.findById(id);
  }
}

export class UpdateValorUsuarioUseCase {
  constructor(
    private readonly valorUsuarioRepository: IValorUsuarioRepository,
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly facturaCasaRepository: IFacturaCasaRepository,
  ) {}

  async execute(valor: ValorUsuario): Promise<void> {
    assertConsumoLuz(valor.consumoLuz);
    const factura = await this.facturaCasaRepository.findById(valor.idFacturaCasa);
    if (!factura) {
      throw new Error('La factura no existe.');
    }
    const usuario = await this.usuarioRepository.findById(valor.idUsuario);
    if (!usuario) {
      throw new Error('El usuario no existe.');
    }
    if (!usuario.activo) {
      throw new Error('Solo se pueden actualizar consumos de usuarios activos.');
    }
    const otro = await this.valorUsuarioRepository.findByFacturaAndUsuario(
      valor.idFacturaCasa,
      valor.idUsuario,
    );
    if (otro && otro.id !== valor.id) {
      throw new Error('Ya existe otro registro para este usuario en esta factura.');
    }
    const actualizado: ValorUsuario = {
      ...valor,
      valorAseo: valorAseoParaUsuario(usuario.esCasa),
    };
    await this.valorUsuarioRepository.update(actualizado);
  }
}

export class DeleteValorUsuarioUseCase {
  constructor(private readonly valorUsuarioRepository: IValorUsuarioRepository) {}

  execute(id: number): Promise<void> {
    return this.valorUsuarioRepository.delete(id);
  }
}
