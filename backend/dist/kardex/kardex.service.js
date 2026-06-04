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
exports.KardexService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const log_decorator_1 = require("../shared/decorators/log.decorator");
let KardexService = class KardexService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async obtenerKardexConsolidado() {
        const query = 'EXEC dbo.sp_ObtenerKardexConsolidado';
        return this.prisma.$queryRawUnsafe(query);
    }
    async obtenerMovimientosProducto(idProducto) {
        const query = `EXEC dbo.sp_ObtenerMovimientosProducto @Id_Producto = ${idProducto}`;
        return this.prisma.$queryRawUnsafe(query);
    }
};
exports.KardexService = KardexService;
__decorate([
    (0, log_decorator_1.Log)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KardexService.prototype, "obtenerKardexConsolidado", null);
__decorate([
    (0, log_decorator_1.Log)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KardexService.prototype, "obtenerMovimientosProducto", null);
exports.KardexService = KardexService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], KardexService);
//# sourceMappingURL=kardex.service.js.map