import { Module, Global } from '@nestjs/common';
import { KardexFacade } from './facades/kardex.facade';

@Global()
@Module({
  providers: [KardexFacade],
  exports: [KardexFacade],
})
export class SharedModule {}
