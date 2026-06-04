import { VentasService } from './ventas.service';
declare class VentaItemDto {
    idProducto: number;
    cantidad: number;
}
declare class RegistrarVentaDto {
    items: VentaItemDto[];
}
export declare class VentasController {
    private readonly ventasService;
    constructor(ventasService: VentasService);
    registrarVenta(registrarVentaDto: RegistrarVentaDto): Promise<{
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
export {};
