import { Rfp } from '../../database/rfp.schema';

export interface IRfpService {
  createFromNL(rawText: string): Promise<Rfp>;
  getAll(): Promise<Rfp[]>;
  sendToVendors(rfpId: string, vendorIds: string[]): Promise<any>;
  getComparison(rfpId: string): Promise<any>;
}


