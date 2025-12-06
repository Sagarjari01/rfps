import { Module } from '@nestjs/common';
import { RfpService } from './rfp.service';
import { IRfpManagerToken } from './rfp.manager';
import { RfpRepositoryModule } from '../../repository/rfp/rfp.module';
import { VendorRepositoryModule } from '../../repository/vendor/vendor.module';
import { ProposalRepositoryModule } from '../../repository/proposal/proposal.module';
import { AiModule } from '../../common/ai/ai.module';
import { EmailModule } from '../../common/email/email.module';

@Module({
  imports: [
    RfpRepositoryModule,
    VendorRepositoryModule,
    ProposalRepositoryModule,
    AiModule,
    EmailModule,
  ],
  providers: [
    RfpService,
    {
      provide: IRfpManagerToken,
      useClass: RfpService,
    },
  ],
  exports: [IRfpManagerToken, RfpService],
})
export class RfpServiceModule {}


