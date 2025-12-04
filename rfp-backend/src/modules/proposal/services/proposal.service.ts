import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as imaps from 'imap-simple';
import { simpleParser } from 'mailparser';
import { ProposalRepository } from '../repositories/proposal.repository';
import { AiService } from '../../../common/ai/ai.service';
import { ProposalDocument } from '../schemas/proposal.schema';

@Injectable()
export class ProposalService {
  constructor(
    private readonly proposalRepository: ProposalRepository,
    private readonly aiService: AiService,
    private readonly configService: ConfigService,
  ) {}

  async fetchAndProcessEmails() {
    try {
      const emailUser = this.configService.get<string>('EMAIL_USER');
      const emailPass = this.configService.get<string>('EMAIL_PASS');

      if (!emailUser || !emailPass) {
        throw new Error('EMAIL_USER and EMAIL_PASS must be configured');
      }

      const config = {
        imap: {
          user: emailUser,
          password: emailPass,
          host: 'imap.gmail.com',
          port: 993,
          tls: true,
          authTimeout: 3000,
        },
      };

      const connection = await imaps.connect(config);
      await connection.openBox('INBOX');

      // 1. Search for UNSEEN emails with "RFP" in the subject
      const searchCriteria = ['UNSEEN', ['SUBJECT', 'RFP Request']];
      const fetchOptions = { bodies: ['HEADER', 'TEXT'], markSeen: true };
      const messages = await connection.search(searchCriteria, fetchOptions);

      console.log(`found ${messages.length} new emails`);
      const processed: ProposalDocument[] = [];

      for (const message of messages) {
      try {
        // 2. Parse the email body
        const all = message.parts.find((part) => part.which === 'TEXT');
        if (!all || !all.body) {
          console.log('Skipping message: no TEXT part found');
          continue;
        }

        const id = message.attributes.uid;
        const idHeader = 'Imap-Id: ' + id + '\r\n';
        const simpleMail = await simpleParser(idHeader + all.body);

        const subject = simpleMail.subject || ''; // "RFP Request [ID: 656...] - Opportunity..."
        // Extract text from email - prefer plain text, fallback to HTML converted to text
        const body = simpleMail.text || this.htmlToText(simpleMail.html || '') || '';
        const sender = simpleMail.from?.text || simpleMail.from?.value?.[0]?.address || 'Unknown';

        // 3. Extract RFP ID from Subject (The critical link!)
        // Matches "ID: " followed by alphanumeric characters
        const rfpIdMatch = subject.match(/ID: ([a-zA-Z0-9]+)/);
        const rfpId = rfpIdMatch ? rfpIdMatch[1] : null;

        if (rfpId && body) {
          // 4. Use AI to extract Price/Terms
          const extractedData = await this.aiService.parseVendorEmail(body);

          // 5. Save to Database
          const saved = await this.proposalRepository.create({
            rfpId: rfpId,
            vendorName: sender,
            rawEmailBody: body,
            price: extractedData.price || 0,
            deliveryDate: extractedData.deliveryDate || 'Unknown',
            warranty: extractedData.warranty || 'None',
          });
          processed.push(saved);
        } else {
          console.log(`Skipping message: missing rfpId (${rfpId}) or body`);
        }
      } catch (error) {
        console.error('Error processing email:', error);
        // Continue processing other emails even if one fails
      }
    }

      connection.end();
      return { status: 'success', processedCount: processed.length, data: processed };
    } catch (error) {
      console.error('Error fetching emails:', error);
      return {
        status: 'error',
        message: error.message || 'Failed to fetch emails',
        processedCount: 0,
        data: [],
      };
    }
  }

  async getAllProposals(rfpId: string) {
    return this.proposalRepository.findAllByRfpId(rfpId);
  }

  private htmlToText(html: string): string {
    if (!html) return '';
    // Simple HTML to text conversion - remove HTML tags
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  }
}

