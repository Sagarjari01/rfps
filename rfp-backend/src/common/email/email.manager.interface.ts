export const IEmailManagerToken = 'IEmailManager';

export interface IEmailManager {
  sendRfpEmail(to: string, subject: string, content: string): Promise<void>;
}

