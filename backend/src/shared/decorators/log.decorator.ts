import { Logger } from '@nestjs/common';

/**
 * Decorador de Método para Auditoría
 * Registra en consola la invocación y parámetros de las operaciones críticas del negocio.
 */
export function Log() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const className = target.constructor.name;
      Logger.log(
        `[AUDIT_LOG] Ejecutando: ${className}.${propertyKey} | Parámetros: ${JSON.stringify(args)}`,
        'AuditLogger'
      );
      
      const result = originalMethod.apply(this, args);
      
      // Manejar promesas de forma adecuada si el método es asíncrono
      if (result instanceof Promise) {
        return result.then((val) => {
          Logger.log(
            `[AUDIT_LOG] Completado: ${className}.${propertyKey} exitosamente.`,
            'AuditLogger'
          );
          return val;
        }).catch((err) => {
          Logger.error(
            `[AUDIT_LOG] Fallido: ${className}.${propertyKey} | Error: ${err.message}`,
            err.stack,
            'AuditLogger'
          );
          throw err;
        });
      }

      Logger.log(
        `[AUDIT_LOG] Completado: ${className}.${propertyKey} exitosamente.`,
        'AuditLogger'
      );
      return result;
    };

    return descriptor;
  };
}
