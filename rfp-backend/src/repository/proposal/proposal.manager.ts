import { ProposalDocument } from '../../database/proposal.schema';

export const IProposalRepositoryManagerToken = 'IProposalRepositoryManager';

export interface IProposalRepositoryManager {
  create(data: Partial<ProposalDocument>): Promise<ProposalDocument>;
  findAll(): Promise<ProposalDocument[]>;
  findOne(filter: Record<string, any>): Promise<ProposalDocument | null>;
  findAllByRfpId(rfpId: string): Promise<ProposalDocument[]>;
}
