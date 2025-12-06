import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as imaps from 'imap-simple';
import { simpleParser } from 'mailparser';
import { IProposalRepositoryManager, IProposalRepositoryManagerToken } from '../../repository/proposal/proposal.manager';
import { AiService } from '../../common/ai/ai.service';
import { ProposalDocument } from '../../database/proposal.schema';
import { IProposalManager } from './proposal.manager';

@Injectable()
export class ProposalService implements IProposalManager {
  constructor(
    @Inject(IProposalRepositoryManagerToken) private readonly proposalRepository: IProposalRepositoryManager,
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
          tlsOptions: { rejectUnauthorized: false },
          authTimeout: 3000,
        },
      };

      const connection = await imaps.connect(config);
      await connection.openBox('INBOX');

      const searchCriteria = [['SUBJECT', 'RFP Request']];
      const fetchOptions = { bodies: ['HEADER', 'TEXT'], markSeen: true };
      const messages = await connection.search(searchCriteria, fetchOptions);

      console.log(`found ${messages.length} emails matching criteria`);
      const processed: ProposalDocument[] = [];

      for (const message of messages) {
        try {
          const headerPart = message.parts.find((part) => part.which === 'HEADER');

          const subject = headerPart?.body?.subject?.[0] || '';
          const sender = headerPart?.body?.from?.[0] || 'Unknown';

          console.log(`Checking email: "${subject}"`);

          const rfpIdMatch = subject.match(/ID: ([a-zA-Z0-9]+)/);
          const rfpId = rfpIdMatch ? rfpIdMatch[1] : null;

          if (!rfpId) {
            console.log('Skipping: No RFP ID found in Subject line.');
            continue;
          }

          const existing = await this.proposalRepository.findOne({
            rfpId: rfpId,
            vendorName: sender,
          });

          if (existing) {
            console.log(`Skipping: Proposal from ${sender} already exists.`);
            continue;
          }

          const textPart = message.parts.find((part) => part.which === 'TEXT');
          if (!textPart) {
            console.log('Skipping: Email has no body text.');
            continue;
          }

          const fullRawEmail = `Subject: ${subject}\r\n\r\n${textPart.body}`;
          const parsedMail = await simpleParser(fullRawEmail);
          const body = parsedMail.text || this.htmlToText(parsedMail.html || '') || textPart.body;

          console.log(`Parsing email from ${sender} for RFP ${rfpId}...`);
          const extractedData = await this.aiService.parseVendorEmail(body);

          const saved = await this.proposalRepository.create({
            rfpId: rfpId,
            vendorName: sender,
            rawEmailBody: body,
            price: extractedData.price || 0,
            deliveryDate: extractedData.deliveryDate || 'Unknown',
            warranty: extractedData.warranty || 'None',
          });
          processed.push(saved);
        } catch (error) {
          console.error('Error processing specific email:', error);
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
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  }
}

