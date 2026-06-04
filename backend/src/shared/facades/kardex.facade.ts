import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class KardexFacade {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registra una Compra de forma transaccional (ACID)
   * 1. Inserta cabecera y detalles de compra.
   * 2. Actualiza costo y precioVenta (Costo * 1.35) en la tabla Productos.
   * 3. Registra movimiento de inventario de Entrada (1).
   */
  async registrarCompra(compraDto: {
    items: { idProducto: number; cantidad: number; precio: number }[];
  }) {
    return this.prisma.$transaction(async (tx) => {
      let subTotal = 0;
      const detailsToCreate: { idProducto: number; cantidad: number; precio: number; subTotal: number; igv: number; total: number }[] = [];

      // 1. Calcular totales para cada ítem
      for (const item of compraDto.items) {
        const itemSubTotal = item.cantidad * item.precio;
        const itemIgv = itemSubTotal * 0.18;
        const itemTotal = itemSubTotal + itemIgv;
        subTotal += itemSubTotal;

        detailsToCreate.push({
          idProducto: item.idProducto,
          cantidad: item.cantidad,
          precio: item.precio,
          subTotal: itemSubTotal,
          igv: itemIgv,
          total: itemTotal,
        });
      }

      const igv = subTotal * 0.18;
      const total = subTotal + igv;

      // 2. Insertar CompraCab
      const compraCab = await tx.compraCab.create({
        data: {
          subTotal,
          igv,
          total,
        },
      });

      // 3. Insertar CompraDet y actualizar Productos
      for (const det of detailsToCreate) {
        await tx.compraDet.create({
          data: {
            idCompraCab: compraCab.id,
            idProducto: det.idProducto,
            cantidad: det.cantidad,
            precio: det.precio,
            subTotal: det.subTotal,
            igv: det.igv,
            total: det.total,
          },
        });

        // Actualizar automáticamente Costo y PrecioVenta (Costo * 1.35)
        const nuevoPrecioVenta = det.precio * 1.35;
        await tx.product.update({
          where: { id: det.idProducto },
          data: {
            costo: det.precio,
            precioVenta: nuevoPrecioVenta,
          },
        });
      }

      // 4. Registrar MovimientoCab (Entrada = 1)
      const movimientoCab = await tx.movimientoCab.create({
        data: {
          idTipoMovimiento: 1, // Entrada
          idDocumentoOrigen: compraCab.id,
        },
      });

      // 5. Registrar Movimientodet
      for (const det of detailsToCreate) {
        await tx.movimientoDet.create({
          data: {
            idMovimientoCab: movimientoCab.id,
            idProducto: det.idProducto,
            cantidad: det.cantidad,
          },
        });
      }

      return {
        compraId: compraCab.id,
        subTotal,
        igv,
        total,
      };
    });
  }

  /**
   * Registra una Venta de forma transaccional (ACID)
   * 1. Valida stock en tiempo real mediante el Stored Procedure de SQL Server.
   * 2. Inserta cabecera y detalles de venta.
   * 3. Registra movimiento de inventario de Salida (2).
   */
  async registrarVenta(ventaDto: {
    items: { idProducto: number; cantidad: number }[];
  }) {
    return this.prisma.$transaction(async (tx) => {
      let subTotal = 0;
      const detailsToCreate: { idProducto: number; cantidad: number; precio: number; subTotal: number; igv: number; total: number }[] = [];

      for (const item of ventaDto.items) {
        // Validar Stock actual mediante Stored Procedure de SQL Server
        // Se ejecuta una consulta raw invocando el procedimiento almacenado
        const result: any[] = await tx.$queryRawUnsafe(`
          DECLARE @Stock INT;
          EXEC dbo.sp_ObtenerStockProducto @Id_Producto = ${item.idProducto}, @StockActual = @Stock OUTPUT;
          SELECT @Stock AS Stock;
        `);
        
        const stockActual = result[0]?.Stock ?? 0;

        if (stockActual < item.cantidad) {
          const producto = await tx.product.findUnique({ where: { id: item.idProducto } });
          throw new BadRequestException(
            `Stock insuficiente para el producto '${producto?.nombre || item.idProducto}'. Disponible: ${stockActual}, Solicitado: ${item.cantidad}`
          );
        }

        // Obtener datos del producto para precio de venta
        const producto = await tx.product.findUnique({
          where: { id: item.idProducto },
        });

        if (!producto) {
          throw new BadRequestException(`Producto con ID ${item.idProducto} no existe.`);
        }

        const precioVenta = Number(producto.precioVenta);
        const itemSubTotal = item.cantidad * precioVenta;
        const itemIgv = itemSubTotal * 0.18;
        const itemTotal = itemSubTotal + itemIgv;
        subTotal += itemSubTotal;

        detailsToCreate.push({
          idProducto: item.idProducto,
          cantidad: item.cantidad,
          precio: precioVenta,
          subTotal: itemSubTotal,
          igv: itemIgv,
          total: itemTotal,
        });
      }

      const igv = subTotal * 0.18;
      const total = subTotal + igv;

      // Insertar VentaCab
      const ventaCab = await tx.ventaCab.create({
        data: {
          subTotal,
          igv,
          total,
        },
      });

      // Insertar VentaDet
      for (const det of detailsToCreate) {
        await tx.ventaDet.create({
          data: {
            idVentaCab: ventaCab.id,
            idProducto: det.idProducto,
            cantidad: det.cantidad,
            precio: det.precio,
            subTotal: det.subTotal,
            igv: det.igv,
            total: det.total,
          },
        });
      }

      // Registrar MovimientoCab (Salida = 2)
      const movimientoCab = await tx.movimientoCab.create({
        data: {
          idTipoMovimiento: 2, // Salida
          idDocumentoOrigen: ventaCab.id,
        },
      });

      // Registrar Movimientodet
      for (const det of detailsToCreate) {
        await tx.movimientoDet.create({
          data: {
            idMovimientoCab: movimientoCab.id,
            idProducto: det.idProducto,
            cantidad: det.cantidad,
          },
        });
      }

      return {
        ventaId: ventaCab.id,
        subTotal,
        igv,
        total,
      };
    });
  }
}
