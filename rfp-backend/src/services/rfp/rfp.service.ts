import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IRfpManager } from './rfp.manager';
import { IRfpRepositoryManager, IRfpRepositoryManagerToken } from '../../repository/rfp/rfp.manager';
import { IVendorRepositoryManager, IVendorRepositoryManagerToken } from '../../repository/vendor/vendor.manager';
import { IProposalRepositoryManager, IProposalRepositoryManagerToken } from '../../repository/proposal/proposal.manager';
import { Rfp } from '../../database/rfp.schema';
import { AiService } from '../../common/ai/ai.service';
import { IEmailManager, IEmailManagerToken } from '../../common/email/email.manager.interface';

@Injectable()
export class RfpService implements IRfpManager {
  constructor(
    @Inject(IRfpRepositoryManagerToken) private readonly rfpRepository: IRfpRepositoryManager,
    @Inject(IVendorRepositoryManagerToken) private readonly vendorRepository: IVendorRepositoryManager,
    @Inject(IProposalRepositoryManagerToken) private readonly proposalRepository: IProposalRepositoryManager,
    private readonly aiService: AiService,
    @Inject(IEmailManagerToken) private readonly emailManager: IEmailManager,
  ) {}

  async createFromNL(rawText: string): Promise<Rfp> {
    const structuredData = await this.aiService.extractRfpStructure(rawText);

    return this.rfpRepository.create({
      userRequest: rawText,
      structuredData: structuredData,
      status: 'active'
    });
  }

  async getAll(): Promise<Rfp[]> {
    return this.rfpRepository.findAll();
  }

  async sendToVendors(rfpId: string, vendorIds: string[]): Promise<any> {
    const rfp = await this.rfpRepository.findOne({ _id: rfpId });
    if (!rfp) throw new NotFoundException('RFP not found');

    const results: Array<{ vendor: string; status: string }> = [];
    for (const vendorId of vendorIds) {
      const vendor = await this.vendorRepository.findOne({ _id: vendorId });
      if (vendor) {
        const subject = `RFP Request [ID: ${rfp._id}] - Opportunity to Bid`;

        const content = `
          Hello ${vendor.name},

          We are looking for the following:
          ${rfp.userRequest}

          Technical Requirements:
          ${JSON.stringify(rfp.structuredData, null, 2)}

          Please reply to this email with your best price.
        `;

        await this.emailManager.sendRfpEmail(vendor.email, subject, content);
        results.push({ vendor: vendor.name, status: 'sent' });
      }
    }

    rfp.status = 'sent';
    await rfp.save();

    return { message: 'Emails sent successfully', details: results };
  }

  async getComparison(rfpId: string): Promise<any> {
    const rfp = await this.rfpRepository.findOne({ _id: rfpId });
    if (!rfp) throw new NotFoundException('RFP not found');

    const proposals = await this.proposalRepository.findAllByRfpId(rfpId);

    if (proposals.length === 0) {
      return { message: 'No proposals received yet. Cannot compare.' };
    }

    const aiVerdict = await this.aiService.compareProposals(rfp.userRequest, proposals);

    return {
      rfpRequest: rfp.userRequest,
      proposals: proposals,
      aiRecommendation: aiVerdict,
    };
  }
}

