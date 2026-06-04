import { Controller, Get, Post, Put, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';

class CreateProductDto {
  @ApiProperty({ example: 'Paracetamol 500mg', description: 'Nombre del producto' })
  nombre!: string;

  @ApiProperty({ example: 'L-PAR001', description: 'Número de lote', required: false })
  nroLote?: string;

  @ApiProperty({ example: 10.0, description: 'Costo base unitario' })
  costo!: number;

  @ApiProperty({ example: 13.5, description: 'Precio de venta al público' })
  precioVenta!: number;
}

class UpdateProductDto {
  @ApiProperty({ example: 'Paracetamol 500mg (Modificado)', description: 'Nombre del producto', required: false })
  nombre?: string;

  @ApiProperty({ example: 'L-PAR001-MOD', description: 'Número de lote', required: false })
  nroLote?: string;

  @ApiProperty({ example: 12.0, description: 'Costo base unitario', required: false })
  costo?: number;

  @ApiProperty({ example: 16.2, description: 'Precio de venta al público', required: false })
  precioVenta?: number;
}

@ApiTags('Productos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado (Falta token JWT válido).' })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productosService.create(createProductDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un producto por su ID' })
  @ApiResponse({ status: 200, description: 'Producto actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productosService.update(id, updateProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los productos registrados' })
  @ApiResponse({ status: 200, description: 'Lista de productos retornada.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  async findAll() {
    return this.productosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener el detalle de un producto por ID' })
  @ApiResponse({ status: 200, description: 'Detalle de producto retornado.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.findOne(id);
  }
}
