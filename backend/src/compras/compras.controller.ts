import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ComprasService } from './compras.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';

class CompraItemDto {
  @ApiProperty({ example: 1, description: 'ID del Producto' })
  idProducto!: number;

  @ApiProperty({ example: 100, description: 'Cantidad comprada' })
  cantidad!: number;

  @ApiProperty({ example: 10.0, description: 'Costo base unitario pagado' })
  precio!: number;
}

class RegistrarCompraDto {
  @ApiProperty({ type: [CompraItemDto], description: 'Lista de productos a comprar' })
  items!: CompraItemDto[];
}

@ApiTags('Compras')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('compras')
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una nueva orden de compra' })
  @ApiResponse({ status: 201, description: 'Compra registrada transaccionalmente e inventario incrementado.' })
  @ApiResponse({ status: 400, description: 'Payload inválido.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  async registrarCompra(@Body() registrarCompraDto: RegistrarCompraDto) {
    return this.comprasService.registrarCompra(registrarCompraDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las compras registradas con sus detalles' })
  @ApiResponse({ status: 200, description: 'Listado de compras obtenido.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  async listarCompras() {
    return this.comprasService.listarCompras();
  }
}
