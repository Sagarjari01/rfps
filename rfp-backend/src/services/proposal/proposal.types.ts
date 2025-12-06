import { ProposalDocument } from '../../database/proposal.schema';

export interface IProposalService {
  fetchAndProcessEmails(): Promise<any>;
  getAllProposals(rfpId: string): Promise<ProposalDocument[]>;
}


