import { ComprasService } from './compras.service';
declare class CompraItemDto {
    idProducto: number;
    cantidad: number;
    precio: number;
}
declare class RegistrarCompraDto {
    items: CompraItemDto[];
}
export declare class ComprasController {
    private readonly comprasService;
    constructor(comprasService: ComprasService);
    registrarCompra(registrarCompraDto: RegistrarCompraDto): Promise<{
        compraId: number;
        subTotal: number;
        igv: number;
        total: number;
    }>;
    listarCompras(): Promise<({
        compraDets: ({
            producto: {
                nombre: string;
                nroLote: string | null;
                fecRegistro: Date;
                costo: import("@prisma/client/runtime/library").Decimal;
                precioVenta: import("@prisma/client/runtime/library").Decimal;
                id: number;
            };
        } & {
            id: number;
            subTotal: import("@prisma/client/runtime/library").Decimal;
            igv: import("@prisma/client/runtime/library").Decimal;
            total: import("@prisma/client/runtime/library").Decimal;
            cantidad: number;
            precio: import("@prisma/client/runtime/library").Decimal;
            idCompraCab: number;
            idProducto: number;
        })[];
    } & {
        fecRegistro: Date;
        id: number;
        subTotal: import("@prisma/client/runtime/library").Decimal;
        igv: import("@prisma/client/runtime/library").Decimal;
        total: import("@prisma/client/runtime/library").Decimal;
    })[]>;
}
export {};
