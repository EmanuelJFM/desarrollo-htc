import { ProductosService } from './productos.service';
declare class CreateProductDto {
    nombre: string;
    nroLote?: string;
    costo: number;
    precioVenta: number;
}
declare class UpdateProductDto {
    nombre?: string;
    nroLote?: string;
    costo?: number;
    precioVenta?: number;
}
export declare class ProductosController {
    private readonly productosService;
    constructor(productosService: ProductosService);
    create(createProductDto: CreateProductDto): Promise<{
        nombre: string;
        nroLote: string | null;
        fecRegistro: Date;
        costo: import("@prisma/client/runtime/library").Decimal;
        precioVenta: import("@prisma/client/runtime/library").Decimal;
        id: number;
    }>;
    update(id: number, updateProductDto: UpdateProductDto): Promise<{
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
export {};
