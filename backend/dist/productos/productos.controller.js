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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductosController = void 0;
const common_1 = require("@nestjs/common");
const productos_service_1 = require("./productos.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
class CreateProductDto {
    nombre;
    nroLote;
    costo;
    precioVenta;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Paracetamol 500mg', description: 'Nombre del producto' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'L-PAR001', description: 'Número de lote', required: false }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "nroLote", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10.0, description: 'Costo base unitario' }),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "costo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 13.5, description: 'Precio de venta al público' }),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "precioVenta", void 0);
class UpdateProductDto {
    nombre;
    nroLote;
    costo;
    precioVenta;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Paracetamol 500mg (Modificado)', description: 'Nombre del producto', required: false }),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'L-PAR001-MOD', description: 'Número de lote', required: false }),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "nroLote", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12.0, description: 'Costo base unitario', required: false }),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "costo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 16.2, description: 'Precio de venta al público', required: false }),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "precioVenta", void 0);
let ProductosController = class ProductosController {
    productosService;
    constructor(productosService) {
        this.productosService = productosService;
    }
    async create(createProductDto) {
        return this.productosService.create(createProductDto);
    }
    async update(id, updateProductDto) {
        return this.productosService.update(id, updateProductDto);
    }
    async findAll() {
        return this.productosService.findAll();
    }
    async findOne(id) {
        return this.productosService.findOne(id);
    }
};
exports.ProductosController = ProductosController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar un nuevo producto' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Producto creado exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado (Falta token JWT válido).' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateProductDto]),
    __metadata("design:returntype", Promise)
], ProductosController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un producto por su ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Producto actualizado exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Producto no encontrado.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, UpdateProductDto]),
    __metadata("design:returntype", Promise)
], ProductosController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos los productos registrados' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de productos retornada.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener el detalle de un producto por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Detalle de producto retornado.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Producto no encontrado.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductosController.prototype, "findOne", null);
exports.ProductosController = ProductosController = __decorate([
    (0, swagger_1.ApiTags)('Productos'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('productos'),
    __metadata("design:paramtypes", [productos_service_1.ProductosService])
], ProductosController);
//# sourceMappingURL=productos.controller.js.map