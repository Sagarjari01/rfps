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
    // Try gemini-pro first (most stable), fallback to gemini-1.5-flash-latest if needed
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
      
      // Clean up if AI adds markdown backticks
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error('AI Error:', error);
      // Fallback if AI fails (prevents app crash)
      return { error: 'Failed to parse', original: userText };
    }
  }
}

