import { PrismaService } from '../prisma/prisma.service';
export declare class ProductosService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: {
        nombre: string;
        nroLote?: string;
        costo: number;
        precioVenta: number;
    }): Promise<{
        nombre: string;
        nroLote: string | null;
        fecRegistro: Date;
        costo: import("@prisma/client/runtime/library").Decimal;
        precioVenta: import("@prisma/client/runtime/library").Decimal;
        id: number;
    }>;
    update(id: number, data: {
        nombre?: string;
        nroLote?: string;
        costo?: number;
        precioVenta?: number;
    }): Promise<{
        nombre: string;
        nroLote: string | null;
        fecRegistro: Date;
        costo: import("@prisma/client/runtime/library").Decimal;
        precioVenta: import("@prisma/client/runtime/library").Decimal;
        id: number;
    }>;
    findAll(): Promise<{
        nombre: string;
        nroLote: string | null;
        fecRegistro: Date;
        costo: import("@prisma/client/runtime/library").Decimal;
        precioVenta: import("@prisma/client/runtime/library").Decimal;
        id: number;
    }[]>;
    findOne(id: number): Promise<{
        nombre: string;
        nroLote: string | null;
        fecRegistro: Date;
        costo: import("@prisma/client/runtime/library").Decimal;
        precioVenta: import("@prisma/client/runtime/library").Decimal;
        id: number;
    }>;
}
