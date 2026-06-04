"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KardexFacade = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let KardexFacade = class KardexFacade {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async registrarCompra(compraDto) {
        return this.prisma.$transaction(async (tx) => {
            let subTotal = 0;
            const detailsToCreate = [];
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
            const compraCab = await tx.compraCab.create({
                data: {
                    subTotal,
                    igv,
                    total,
                },
            });
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
                const nuevoPrecioVenta = det.precio * 1.35;
                await tx.product.update({
                    where: { id: det.idProducto },
                    data: {
                        costo: det.precio,
                        precioVenta: nuevoPrecioVenta,
                    },
                });
            }
            const movimientoCab = await tx.movimientoCab.create({
                data: {
                    idTipoMovimiento: 1,
                    idDocumentoOrigen: compraCab.id,
                },
            });
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
    async registrarVenta(ventaDto) {
        return this.prisma.$transaction(async (tx) => {
            let subTotal = 0;
            const detailsToCreate = [];
            for (const item of ventaDto.items) {
                const result = await tx.$queryRawUnsafe(`
          DECLARE @Stock INT;
          EXEC dbo.sp_ObtenerStockProducto @Id_Producto = ${item.idProducto}, @StockActual = @Stock OUTPUT;
          SELECT @Stock AS Stock;
        `);
                const stockActual = result[0]?.Stock ?? 0;
                if (stockActual < item.cantidad) {
                    const producto = await tx.product.findUnique({ where: { id: item.idProducto } });
                    throw new common_1.BadRequestException(`Stock insuficiente para el producto '${producto?.nombre || item.idProducto}'. Disponible: ${stockActual}, Solicitado: ${item.cantidad}`);
                }
                const producto = await tx.product.findUnique({
                    where: { id: item.idProducto },
                });
                if (!producto) {
                    throw new common_1.BadRequestException(`Producto con ID ${item.idProducto} no existe.`);
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
            const ventaCab = await tx.ventaCab.create({
                data: {
                    subTotal,
                    igv,
                    total,
                },
            });
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
            const movimientoCab = await tx.movimientoCab.create({
                data: {
                    idTipoMovimiento: 2,
                    idDocumentoOrigen: ventaCab.id,
                },
            });
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
};
exports.KardexFacade = KardexFacade;
exports.KardexFacade = KardexFacade = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], KardexFacade);
//# sourceMappingURL=kardex.facade.js.map