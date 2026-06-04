import { PrismaService } from '../prisma/prisma.service';
import { KardexFacade } from '../shared/facades/kardex.facade';
export declare class ComprasService {
    private readonly prisma;
    private readonly kardexFacade;
    constructor(prisma: PrismaService, kardexFacade: KardexFacade);
    registrarCompra(dto: {
        items: {
            idProducto: number;
            cantidad: number;
            precio: number;
        }[];
    }): Promise<{
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
