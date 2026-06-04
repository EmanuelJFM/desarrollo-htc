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
exports.ComprasController = void 0;
const common_1 = require("@nestjs/common");
const compras_service_1 = require("./compras.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
class CompraItemDto {
    idProducto;
    cantidad;
    precio;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID del Producto' }),
    __metadata("design:type", Number)
], CompraItemDto.prototype, "idProducto", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100, description: 'Cantidad comprada' }),
    __metadata("design:type", Number)
], CompraItemDto.prototype, "cantidad", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10.0, description: 'Costo base unitario pagado' }),
    __metadata("design:type", Number)
], CompraItemDto.prototype, "precio", void 0);
class RegistrarCompraDto {
    items;
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CompraItemDto], description: 'Lista de productos a comprar' }),
    __metadata("design:type", Array)
], RegistrarCompraDto.prototype, "items", void 0);
let ComprasController = class ComprasController {
    comprasService;
    constructor(comprasService) {
        this.comprasService = comprasService;
    }
    async registrarCompra(registrarCompraDto) {
        return this.comprasService.registrarCompra(registrarCompraDto);
    }
    async listarCompras() {
        return this.comprasService.listarCompras();
    }
};
exports.ComprasController = ComprasController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar una nueva orden de compra' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Compra registrada transaccionalmente e inventario incrementado.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Payload inválido.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegistrarCompraDto]),
    __metadata("design:returntype", Promise)
], ComprasController.prototype, "registrarCompra", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todas las compras registradas con sus detalles' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listado de compras obtenido.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ComprasController.prototype, "listarCompras", null);
exports.ComprasController = ComprasController = __decorate([
    (0, swagger_1.ApiTags)('Compras'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('compras'),
    __metadata("design:paramtypes", [compras_service_1.ComprasService])
], ComprasController);
//# sourceMappingURL=compras.controller.js.map