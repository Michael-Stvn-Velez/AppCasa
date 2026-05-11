import type { FacturaCasa, FacturaCasaCreateInput } from '../../Domain/Entities/FacturaCasa';
import type { IFacturaCasaRepository } from '../../Domain/Ports/IFacturaCasaRepository';

function assertPeriodoYValores(input: { anio: number; mes: number; valorLuz: number; valorAseo: number }) {
  if (!Number.isInteger(input.anio) || input.anio < 2000 || input.anio > 2100) {
    throw new Error('El año debe ser un número entero entre 2000 y 2100.');
  }
  if (!Number.isInteger(input.mes) || input.mes < 1 || input.mes > 12) {
    throw new Error('El mes debe ser un número entero entre 1 y 12.');
  }
  if (!Number.isFinite(input.valorLuz) || input.valorLuz < 0) {
    throw new Error('El valor de luz debe ser un número mayor o igual a 0.');
  }
  if (!Number.isFinite(input.valorAseo) || input.valorAseo < 0) {
    throw new Error('El valor de aseo debe ser un número mayor o igual a 0.');
  }
}

export class CreateFacturaCasaUseCase {
  constructor(private readonly facturaCasaRepository: IFacturaCasaRepository) {}

  async execute(input: FacturaCasaCreateInput): Promise<FacturaCasa> {
    assertPeriodoYValores(input);
    const duplicado = await this.facturaCasaRepository.findByAnioMes(input.anio, input.mes);
    if (duplicado) {
      throw new Error('Ya existe una factura para ese año y mes.');
    }
    return this.facturaCasaRepository.create(input);
  }
}

export class GetFacturasCasaUseCase {
  constructor(private readonly facturaCasaRepository: IFacturaCasaRepository) {}

  execute(): Promise<FacturaCasa[]> {
    return this.facturaCasaRepository.findAll();
  }
}

export class GetFacturaCasaByIdUseCase {
  constructor(private readonly facturaCasaRepository: IFacturaCasaRepository) {}

  execute(id: number): Promise<FacturaCasa | null> {
    return this.facturaCasaRepository.findById(id);
  }
}

export class UpdateFacturaCasaUseCase {
  constructor(private readonly facturaCasaRepository: IFacturaCasaRepository) {}

  async execute(factura: FacturaCasa): Promise<void> {
    assertPeriodoYValores(factura);
    const otra = await this.facturaCasaRepository.findByAnioMes(factura.anio, factura.mes);
    if (otra && otra.id !== factura.id) {
      throw new Error('Ya existe otra factura para ese año y mes.');
    }
    await this.facturaCasaRepository.update(factura);
  }
}
