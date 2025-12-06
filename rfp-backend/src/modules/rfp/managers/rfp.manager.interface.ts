import { Rfp } from '../schemas/rfp.schema';

// This token is used for Dependency Injection
export const IRfpManagerToken = 'IRfpManager';

export interface IRfpManager {
  createFromNL(rawText: string): Promise<Rfp>;
  getAll(): Promise<Rfp[]>;
  sendToVendors(rfpId: string, vendorIds: string[]): Promise<any>;
  getComparison(rfpId: string): Promise<any>;
}

