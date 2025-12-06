import { Controller, Get, Post, Query, Inject } from '@nestjs/common';
import { IProposalManager, IProposalManagerToken } from '../services/proposal/proposal.manager';

@Controller('proposals')
export class ProposalController {
  constructor(
    @Inject(IProposalManagerToken) private readonly proposalManager: IProposalManager
  ) {}

  @Post('sync')
  async syncEmails() {
    return this.proposalManager.fetchAndProcessEmails();
  }

  @Get()
  async getProposals(@Query('rfpId') rfpId: string) {
    return this.proposalManager.getAllProposals(rfpId);
  }
}

