import { Module } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { IProposalManagerToken } from './proposal.manager';
import { ProposalRepositoryModule } from '../../repository/proposal/proposal.module';
import { AiModule } from '../../common/ai/ai.module';

@Module({
  imports: [ProposalRepositoryModule, AiModule],
  providers: [
    ProposalService,
    {
      provide: IProposalManagerToken,
      useClass: ProposalService,
    },
  ],
  exports: [IProposalManagerToken, ProposalService],
})
export class ProposalServiceModule {}

