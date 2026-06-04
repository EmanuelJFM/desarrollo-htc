import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { KardexService } from './kardex.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Kardex / Inventario')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('kardex')
export class KardexController {
  constructor(private readonly kardexService: KardexService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener el Kardex Consolidado (Stock actual de todos los productos)' })
  @ApiResponse({ status: 200, description: 'Kardex consolidado retornado exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  async obtenerKardexConsolidado() {
    return this.kardexService.obtenerKardexConsolidado();
  }

  @Get('producto/:id')
  @ApiOperation({ summary: 'Obtener el historial cronológico de movimientos de un producto por su ID' })
  @ApiResponse({ status: 200, description: 'Historial de movimientos obtenido.' })
  @ApiResponse({ status: 404, description: 'El producto especificado no existe.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  async obtenerMovimientosProducto(@Param('id', ParseIntPipe) id: number) {
    return this.kardexService.obtenerMovimientosProducto(id);
  }
}
