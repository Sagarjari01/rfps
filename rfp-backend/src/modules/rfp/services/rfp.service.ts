import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IRfpManager } from '../managers/rfp.manager.interface';
import { RfpRepository } from '../repositories/rfp.repository';
import { Rfp } from '../schemas/rfp.schema';
import { AiService } from '../../../common/ai/ai.service';
import { IEmailManager, IEmailManagerToken } from '../../../common/email/email.manager.interface';
import { VendorRepository } from '../../vendor/repositories/vendor.repository';
import { ProposalRepository } from '../../proposal/repositories/proposal.repository';

@Injectable()
export class RfpService implements IRfpManager {
  constructor(
    private readonly rfpRepository: RfpRepository,
    private readonly vendorRepository: VendorRepository,
    private readonly proposalRepository: ProposalRepository,
    private readonly aiService: AiService,
    @Inject(IEmailManagerToken) private readonly emailManager: IEmailManager,
  ) {}

  async createFromNL(rawText: string): Promise<Rfp> {
    // 1. Ask Gemini to structure the data
    const structuredData = await this.aiService.extractRfpStructure(rawText);

    // 2. Save both raw text and AI result to Mongo
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
    // 1. Get the RFP
    const rfp = await this.rfpRepository.findOne({ _id: rfpId });
    if (!rfp) throw new NotFoundException('RFP not found');

    // 2. Get the Vendors
    const results: Array<{ vendor: string; status: string }> = [];
    for (const vendorId of vendorIds) {
      const vendor = await this.vendorRepository.findOne({ _id: vendorId });
      if (vendor) {
        // 3. Construct the email
        // TIP: We put the RFP ID in the Subject line.
        // This is CRITICAL for step 4 (Reading the reply).
        const subject = `RFP Request [ID: ${rfp._id}] - Opportunity to Bid`;

        const content = `
          Hello ${vendor.name},

          We are looking for the following:
          ${rfp.userRequest}

          Technical Requirements:
          ${JSON.stringify(rfp.structuredData, null, 2)}

          Please reply to this email with your best price.
        `;

        // 4. Send Email
        await this.emailManager.sendRfpEmail(vendor.email, subject, content);
        results.push({ vendor: vendor.name, status: 'sent' });
      }
    }

    // 5. Update RFP status
    rfp.status = 'sent';
    await rfp.save();

    return { message: 'Emails sent successfully', details: results };
  }

  async getComparison(rfpId: string): Promise<any> {
    // 1. Get the original RFP (What we wanted)
    const rfp = await this.rfpRepository.findOne({ _id: rfpId });
    if (!rfp) throw new NotFoundException('RFP not found');

    // 2. Get all proposals (What we got)
    const proposals = await this.proposalRepository.findAllByRfpId(rfpId);

    if (proposals.length === 0) {
      return { message: 'No proposals received yet. Cannot compare.' };
    }

    // 3. Ask AI to judge
    const aiVerdict = await this.aiService.compareProposals(rfp.userRequest, proposals);

    // 4. Return everything combined
    return {
      rfpRequest: rfp.userRequest,
      proposals: proposals,
      aiRecommendation: aiVerdict,
    };
  }
}

