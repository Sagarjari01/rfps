import { ProposalDocument } from '../../database/proposal.schema';

export const IProposalManagerToken = 'IProposalManager';

export interface IProposalManager {
  fetchAndProcessEmails(): Promise<{
    status: string;
    processedCount: number;
    data: ProposalDocument[];
    message?: string;
  }>;
  getAllProposals(rfpId: string): Promise<ProposalDocument[]>;
}
