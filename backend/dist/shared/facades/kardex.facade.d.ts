import { PrismaService } from '../../prisma/prisma.service';
export declare class KardexFacade {
    private readonly prisma;
    constructor(prisma: PrismaService);
    registrarCompra(compraDto: {
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
    registrarVenta(ventaDto: {
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
}
