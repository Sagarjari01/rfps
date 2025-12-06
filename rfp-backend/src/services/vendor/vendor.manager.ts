import { Vendor } from '../../database/vendor.schema';

export const IVendorManagerToken = 'IVendorManager';

export interface IVendorManager {
  addVendor(name: string, email: string, category: string): Promise<Vendor>;
  listVendors(): Promise<Vendor[]>;
}


