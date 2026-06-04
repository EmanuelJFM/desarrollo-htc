"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const log_decorator_1 = require("../shared/decorators/log.decorator");
let ProductosService = class ProductosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.product.create({
            data: {
                nombre: data.nombre,
                nroLote: data.nroLote,
                costo: data.costo,
                precioVenta: data.precioVenta,
            },
        });
    }
    async update(id, data) {
        const exists = await this.prisma.product.findUnique({ where: { id } });
        if (!exists) {
            throw new common_1.NotFoundException(`Producto con ID ${id} no encontrado.`);
        }
        return this.prisma.product.update({
            where: { id },
            data,
        });
    }
    async findAll() {
        return this.prisma.product.findMany({
            orderBy: { nombre: 'asc' },
        });
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException(`Producto con ID ${id} no encontrado.`);
        }
        return product;
    }
};
exports.ProductosService = ProductosService;
__decorate([
    (0, log_decorator_1.Log)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductosService.prototype, "create", null);
__decorate([
    (0, log_decorator_1.Log)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ProductosService.prototype, "update", null);
__decorate([
    (0, log_decorator_1.Log)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductosService.prototype, "findAll", null);
__decorate([
    (0, log_decorator_1.Log)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductosService.prototype, "findOne", null);
exports.ProductosService = ProductosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductosService);
//# sourceMappingURL=productos.service.js.map