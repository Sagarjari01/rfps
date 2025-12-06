import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Proposal, ProposalSchema } from '../../database/proposal.schema';
import { ProposalRepository } from './proposal.repository';
import { IProposalRepositoryManagerToken } from './proposal.manager';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Proposal.name, schema: ProposalSchema }]),
  ],
  providers: [
    ProposalRepository,
    {
      provide: IProposalRepositoryManagerToken,
      useClass: ProposalRepository,
    },
  ],
  exports: [IProposalRepositoryManagerToken, ProposalRepository],
})
export class ProposalRepositoryModule {}

