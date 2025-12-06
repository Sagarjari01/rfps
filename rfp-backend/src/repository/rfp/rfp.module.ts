import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Rfp, RfpSchema } from '../../database/rfp.schema';
import { RfpRepository } from './rfp.repository';
import { IRfpRepositoryManagerToken } from './rfp.manager';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rfp.name, schema: RfpSchema }]),
  ],
  providers: [
    RfpRepository,
    {
      provide: IRfpRepositoryManagerToken,
      useClass: RfpRepository,
    },
  ],
  exports: [IRfpRepositoryManagerToken, RfpRepository],
})
export class RfpRepositoryModule {}

