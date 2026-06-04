import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { KardexFacade } from '../shared/facades/kardex.facade';
import { Log } from '../shared/decorators/log.decorator';

@Injectable()
export class ComprasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly kardexFacade: KardexFacade
  ) {}

  @Log()
  async registrarCompra(dto: {
    items: { idProducto: number; cantidad: number; precio: number }[];
  }) {
    // Delegamos al KardexFacade la lógica transaccional de registrar compra, 
    // actualizar precios y registrar entrada en el Kardex.
    return this.kardexFacade.registrarCompra(dto);
  }

  @Log()
  async listarCompras() {
    return this.prisma.compraCab.findMany({
      include: {
        compraDets: {
          include: {
            producto: true,
          },
        },
      },
      orderBy: { fecRegistro: 'desc' },
    });
  }
}
