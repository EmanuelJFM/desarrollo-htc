import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductosModule } from './productos/productos.module';
import { ComprasModule } from './compras/compras.module';
import { VentasModule } from './ventas/ventas.module';
import { KardexModule } from './kardex/kardex.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ProductosModule,
    ComprasModule,
    VentasModule,
    KardexModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
