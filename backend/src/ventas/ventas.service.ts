import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { KardexFacade } from '../shared/facades/kardex.facade';
import { Log } from '../shared/decorators/log.decorator';

@Injectable()
export class VentasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly kardexFacade: KardexFacade
  ) {}

  @Log()
  async registrarVenta(dto: {
    items: { idProducto: number; cantidad: number }[];
  }) {
    // Delegamos al KardexFacade la lógica transaccional de registrar venta,
    // validar stock remanente y registrar salida en el Kardex.
    return this.kardexFacade.registrarVenta(dto);
  }

  @Log()
  async listarVentas() {
    return this.prisma.ventaCab.findMany({
      include: {
        ventaDets: {
          include: {
            producto: true,
          },
        },
      },
      orderBy: { fecRegistro: 'desc' },
    });
  }
}
