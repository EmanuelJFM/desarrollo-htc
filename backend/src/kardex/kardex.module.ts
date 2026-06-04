import { Module } from '@nestjs/common';
import { KardexService } from './kardex.service';
import { KardexController } from './kardex.controller';

@Module({
  providers: [KardexService],
  controllers: [KardexController],
  exports: [KardexService],
})
export class KardexModule {}
