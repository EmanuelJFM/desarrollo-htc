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
exports.KardexController = void 0;
const common_1 = require("@nestjs/common");
const kardex_service_1 = require("./kardex.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let KardexController = class KardexController {
    kardexService;
    constructor(kardexService) {
        this.kardexService = kardexService;
    }
    async obtenerKardexConsolidado() {
        return this.kardexService.obtenerKardexConsolidado();
    }
    async obtenerMovimientosProducto(id) {
        return this.kardexService.obtenerMovimientosProducto(id);
    }
};
exports.KardexController = KardexController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener el Kardex Consolidado (Stock actual de todos los productos)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kardex consolidado retornado exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KardexController.prototype, "obtenerKardexConsolidado", null);
__decorate([
    (0, common_1.Get)('producto/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener el historial cronológico de movimientos de un producto por su ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Historial de movimientos obtenido.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'El producto especificado no existe.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KardexController.prototype, "obtenerMovimientosProducto", null);
exports.KardexController = KardexController = __decorate([
    (0, swagger_1.ApiTags)('Kardex / Inventario'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('kardex'),
    __metadata("design:paramtypes", [kardex_service_1.KardexService])
], KardexController);
//# sourceMappingURL=kardex.controller.js.map