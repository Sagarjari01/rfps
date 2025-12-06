import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../common/repository/base.repository';
import { Proposal, ProposalDocument } from '../../database/proposal.schema';
import { IProposalRepositoryManager } from './proposal.manager';

@Injectable()
export class ProposalRepository extends BaseRepository<ProposalDocument> implements IProposalRepositoryManager {
  constructor(@InjectModel(Proposal.name) private proposalModel: Model<ProposalDocument>) {
    super(proposalModel);
  }

  async findAllByRfpId(rfpId: string): Promise<ProposalDocument[]> {
    return this.proposalModel.find({ rfpId }).exec();
  }
}

