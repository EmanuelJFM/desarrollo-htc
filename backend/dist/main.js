"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: false,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('HCE Enterprise - Kardex API')
        .setDescription('Servicio de API REST para compras, ventas y control consolidado de Kardex e Inventario.')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`Backend de Kardex corriendo exitosamente en: http://localhost:${port}`);
    console.log(`Documentación de Swagger disponible en: http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map