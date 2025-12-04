import { Controller, Get, Post, Query } from '@nestjs/common';
import { ProposalService } from '../services/proposal.service';

@Controller('proposals')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  // The "Check Inbox" button hits this endpoint
  @Post('sync')
  async syncEmails() {
    return this.proposalService.fetchAndProcessEmails();
  }

  // Get all proposals for a specific RFP (for the comparison table later)
  @Get()
  async getProposals(@Query('rfpId') rfpId: string) {
    return this.proposalService.getAllProposals(rfpId);
  }
}

