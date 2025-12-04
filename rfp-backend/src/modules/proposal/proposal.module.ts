import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProposalController } from './controllers/proposal.controller';
import { ProposalService } from './services/proposal.service';
import { ProposalRepository } from './repositories/proposal.repository';
import { Proposal, ProposalSchema } from './schemas/proposal.schema';
import { AiModule } from '../../common/ai/ai.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Proposal.name, schema: ProposalSchema }]),
    AiModule,
  ],
  controllers: [ProposalController],
  providers: [ProposalRepository, ProposalService],
})
export class ProposalModule {}

