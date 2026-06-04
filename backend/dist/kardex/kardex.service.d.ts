import { PrismaService } from '../prisma/prisma.service';
export declare class KardexService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    obtenerKardexConsolidado(): Promise<any[]>;
    obtenerMovimientosProducto(idProducto: number): Promise<any[]>;
}
