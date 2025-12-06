import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private model: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async extractRfpStructure(userText: string): Promise<any> {
    const prompt = `
      You are a procurement expert. Analyze this request: "${userText}"
      
      Extract these details into a strict JSON object:
      - items: array of strings (what is needed)
      - budget: number (approximate total)
      - deadline: string (ISO date if possible, or text)
      - requirements: array of strings (specific specs like RAM, size, etc.)
      
      Output ONLY valid JSON. No markdown formatting.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error('AI Error:', error);
      return { error: 'Failed to parse', original: userText };
    }
  }

  async parseVendorEmail(emailText: string): Promise<any> {
    const prompt = `
      Analyze this email reply from a vendor:

      "${emailText}"

      Extract the following fields into JSON:

      - price: number (just the value, no currency symbols)

      - deliveryDate: string (e.g., "2025-01-20")

      - warranty: string (e.g., "1 year")

      - rating: number (1-10 score based on how professional the tone is)
      
      Output ONLY valid JSON. No markdown formatting.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error('AI Error parsing vendor email:', error);
      return { error: 'Failed to parse', original: emailText };
    }
  }

  async compareProposals(rfpRequest: string, proposals: any[]): Promise<any> {
    const proposalsText = proposals
      .map(
        (p, index) =>
          `Vendor ${index + 1} (${p.vendorName}): Price $${p.price}, Delivery ${p.deliveryDate}, Warranty ${p.warranty}`,
      )
      .join('\n');

    const today = new Date().toDateString();

    const prompt = `
      I am a procurement manager.
      
      Context:
      - Today's Date: ${today} (Use this to calculate relative dates like "next Friday")
      - My Request: "${rfpRequest}"
      
      I received these proposals:
      ${proposalsText}
      
      Task:
      Compare them and recommend the best vendor.
      
      Output JSON only:
      {
        "recommendedVendor": "Name of vendor",
        "reason": "Why they are the best (price, speed, or terms). Be specific about date differences.",
        "score": 95,
        "comparisonSummary": "Short comparison text"
      }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error('AI Error comparing proposals:', error);
      return {
        error: 'Failed to compare',
        recommendedVendor: proposals[0]?.vendorName || 'Unknown',
        reason: 'AI comparison failed, using first proposal',
        score: 0,
        comparisonSummary: 'Comparison unavailable',
      };
    }
  }
}

