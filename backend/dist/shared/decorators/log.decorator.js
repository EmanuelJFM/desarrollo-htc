"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = Log;
const common_1 = require("@nestjs/common");
function Log() {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            const className = target.constructor.name;
            common_1.Logger.log(`[AUDIT_LOG] Ejecutando: ${className}.${propertyKey} | Parámetros: ${JSON.stringify(args)}`, 'AuditLogger');
            const result = originalMethod.apply(this, args);
            if (result instanceof Promise) {
                return result.then((val) => {
                    common_1.Logger.log(`[AUDIT_LOG] Completado: ${className}.${propertyKey} exitosamente.`, 'AuditLogger');
                    return val;
                }).catch((err) => {
                    common_1.Logger.error(`[AUDIT_LOG] Fallido: ${className}.${propertyKey} | Error: ${err.message}`, err.stack, 'AuditLogger');
                    throw err;
                });
            }
            common_1.Logger.log(`[AUDIT_LOG] Completado: ${className}.${propertyKey} exitosamente.`, 'AuditLogger');
            return result;
        };
        return descriptor;
    };
}
//# sourceMappingURL=log.decorator.js.map