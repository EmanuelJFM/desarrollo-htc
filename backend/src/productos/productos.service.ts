import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Log } from '../shared/decorators/log.decorator';

@Injectable()
export class ProductosService {
  constructor(private readonly prisma: PrismaService) {}

  @Log()
  async create(data: { nombre: string; nroLote?: string; costo: number; precioVenta: number }) {
    return this.prisma.product.create({
      data: {
        nombre: data.nombre,
        nroLote: data.nroLote,
        costo: data.costo,
        precioVenta: data.precioVenta,
      },
    });
  }

  @Log()
  async update(id: number, data: { nombre?: string; nroLote?: string; costo?: number; precioVenta?: number }) {
    const exists = await this.prisma.product.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado.`);
    }

    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  @Log()
  async findAll() {
    return this.prisma.product.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  @Log()
  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado.`);
    }
    return product;
  }
}
