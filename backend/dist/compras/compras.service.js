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
exports.ComprasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const kardex_facade_1 = require("../shared/facades/kardex.facade");
const log_decorator_1 = require("../shared/decorators/log.decorator");
let ComprasService = class ComprasService {
    prisma;
    kardexFacade;
    constructor(prisma, kardexFacade) {
        this.prisma = prisma;
        this.kardexFacade = kardexFacade;
    }
    async registrarCompra(dto) {
        return this.kardexFacade.registrarCompra(dto);
    }
    async listarCompras() {
        return this.prisma.compraCab.findMany({
            include: {
                compraDets: {
                    include: {
                        producto: true,
                    },
                },
            },
            orderBy: { fecRegistro: 'desc' },
        });
    }
};
exports.ComprasService = ComprasService;
__decorate([
    (0, log_decorator_1.Log)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ComprasService.prototype, "registrarCompra", null);
__decorate([
    (0, log_decorator_1.Log)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ComprasService.prototype, "listarCompras", null);
exports.ComprasService = ComprasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        kardex_facade_1.KardexFacade])
], ComprasService);
//# sourceMappingURL=compras.service.js.map