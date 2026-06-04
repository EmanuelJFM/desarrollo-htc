import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';

class VentaItemDto {
  @ApiProperty({ example: 1, description: 'ID del Producto' })
  idProducto!: number;

  @ApiProperty({ example: 5, description: 'Cantidad a vender' })
  cantidad!: number;
}

class RegistrarVentaDto {
  @ApiProperty({ type: [VentaItemDto], description: 'Lista de productos a vender' })
  items!: VentaItemDto[];
}

@ApiTags('Ventas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una nueva venta' })
  @ApiResponse({ status: 201, description: 'Venta procesada transaccionalmente e inventario decrementado.' })
  @ApiResponse({ status: 400, description: 'Stock insuficiente para algún producto o datos de payload inválidos.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  async registrarVenta(@Body() registrarVentaDto: RegistrarVentaDto) {
    return this.ventasService.registrarVenta(registrarVentaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las ventas registradas con sus detalles' })
  @ApiResponse({ status: 200, description: 'Listado de ventas obtenido.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  async listarVentas() {
    return this.ventasService.listarVentas();
  }
}
