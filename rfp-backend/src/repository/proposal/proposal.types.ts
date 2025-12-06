import { ProposalDocument } from '../../database/proposal.schema';

export interface IProposalRepository {
  create(data: Partial<ProposalDocument>): Promise<ProposalDocument>;
  findAll(): Promise<ProposalDocument[]>;
  findOne(filter: any): Promise<ProposalDocument | null>;
  findAllByRfpId(rfpId: string): Promise<ProposalDocument[]>;
}

