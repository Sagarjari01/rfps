import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RfpController } from './controllers/rfp.controller';
import { RfpService } from './services/rfp.service';
import { RfpRepository } from './repositories/rfp.repository';
import { Rfp, RfpSchema } from './schemas/rfp.schema';
import { IRfpManagerToken } from './managers/rfp.manager.interface';
import { VendorModule } from '../vendor/vendor.module';
import { ProposalModule } from '../proposal/proposal.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rfp.name, schema: RfpSchema }]),
    VendorModule, // Import VendorModule so we can use its Repository/Service
    ProposalModule, // Import ProposalModule so we can use ProposalRepository
  ],
  controllers: [RfpController],
  providers: [
    RfpRepository,
    {
      provide: IRfpManagerToken, // When someone asks for the Manager...
      useClass: RfpService,      // ...give them the Service.
    },
  ],
})
export class RfpModule {}

