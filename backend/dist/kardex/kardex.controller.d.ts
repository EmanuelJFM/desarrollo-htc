import { KardexService } from './kardex.service';
export declare class KardexController {
    private readonly kardexService;
    constructor(kardexService: KardexService);
    obtenerKardexConsolidado(): Promise<any[]>;
    obtenerMovimientosProducto(id: number): Promise<any[]>;
}
