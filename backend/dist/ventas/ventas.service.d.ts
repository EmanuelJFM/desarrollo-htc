import { PrismaService } from '../prisma/prisma.service';
import { KardexFacade } from '../shared/facades/kardex.facade';
export declare class VentasService {
    private readonly prisma;
    private readonly kardexFacade;
    constructor(prisma: PrismaService, kardexFacade: KardexFacade);
    registrarVenta(dto: {
        items: {
            idProducto: number;
            cantidad: number;
        }[];
    }): Promise<{
        ventaId: number;
        subTotal: number;
        igv: number;
        total: number;
    }>;
    listarVentas(): Promise<({
        ventaDets: ({
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
            idProducto: number;
            idVentaCab: number;
        })[];
    } & {
        fecRegistro: Date;
        id: number;
        subTotal: import("@prisma/client/runtime/library").Decimal;
        igv: import("@prisma/client/runtime/library").Decimal;
        total: import("@prisma/client/runtime/library").Decimal;
    })[]>;
}
