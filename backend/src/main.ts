import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Configurar CORS restrictivo
  // Solo acepta peticiones del origen específico autorizado del frontend (Next.js en el puerto 3000)
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 2. Habilitar validaciones globales de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      transform: true,
    }),
  );

  // 3. Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('HCE Enterprise - Kardex API')
    .setDescription('Servicio de API REST para compras, ventas y control consolidado de Kardex e Inventario.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // 4. Iniciar aplicación
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Backend de Kardex corriendo exitosamente en: http://localhost:${port}`);
  console.log(`Documentación de Swagger disponible en: http://localhost:${port}/api/docs`);
}
bootstrap();
