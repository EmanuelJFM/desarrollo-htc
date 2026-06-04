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
exports.VentasController = void 0;
const common_1 = require("@nestjs/common");
const ventas_service_1 = require("./ventas.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
class VentaItemDto {
    idProducto;
    cantidad;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID del Producto' }),
    __metadata("design:type", Number)
], VentaItemDto.prototype, "idProducto", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5, description: 'Cantidad a vender' }),
    __metadata("design:type", Number)
], VentaItemDto.prototype, "cantidad", void 0);
class RegistrarVentaDto {
    items;
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: [VentaItemDto], description: 'Lista de productos a vender' }),
    __metadata("design:type", Array)
], RegistrarVentaDto.prototype, "items", void 0);
let VentasController = class VentasController {
    ventasService;
    constructor(ventasService) {
        this.ventasService = ventasService;
    }
    async registrarVenta(registrarVentaDto) {
        return this.ventasService.registrarVenta(registrarVentaDto);
    }
    async listarVentas() {
        return this.ventasService.listarVentas();
    }
};
exports.VentasController = VentasController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar una nueva venta' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Venta procesada transaccionalmente e inventario decrementado.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Stock insuficiente para algún producto o datos de payload inválidos.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegistrarVentaDto]),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "registrarVenta", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todas las ventas registradas con sus detalles' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listado de ventas obtenido.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VentasController.prototype, "listarVentas", null);
exports.VentasController = VentasController = __decorate([
    (0, swagger_1.ApiTags)('Ventas'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('ventas'),
    __metadata("design:paramtypes", [ventas_service_1.VentasService])
], VentasController);
//# sourceMappingURL=ventas.controller.js.map