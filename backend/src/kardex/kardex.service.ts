import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Log } from '../shared/decorators/log.decorator';

@Injectable()
export class KardexService {
  constructor(private readonly prisma: PrismaService) {}

  @Log()
  async obtenerKardexConsolidado(): Promise<any[]> {
    // Invocación al Procedimiento Almacenado T-SQL sp_ObtenerKardexConsolidado
    const query = 'EXEC dbo.sp_ObtenerKardexConsolidado';
    return this.prisma.$queryRawUnsafe(query);
  }

  @Log()
  async obtenerMovimientosProducto(idProducto: number): Promise<any[]> {
    // Invocación al Procedimiento Almacenado T-SQL sp_ObtenerMovimientosProducto
    const query = `EXEC dbo.sp_ObtenerMovimientosProducto @Id_Producto = ${idProducto}`;
    return this.prisma.$queryRawUnsafe(query);
  }
}
