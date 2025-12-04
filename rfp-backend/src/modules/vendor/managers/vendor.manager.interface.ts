import { Vendor } from '../schemas/vendor.schema';

export const IVendorManagerToken = 'IVendorManager';

export interface IVendorManager {
  addVendor(name: string, email: string, category: string): Promise<Vendor>;
  listVendors(): Promise<Vendor[]>;
}

