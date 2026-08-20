import { Module } from '@nestjs/common';
import { MasterLocatypesService } from './master-locatypes.service';
import { MasterLocatypesController } from './master-locatypes.controller';

@Module({
  controllers: [MasterLocatypesController],
  providers: [MasterLocatypesService],
})
export class MasterLocatypesModule {}
