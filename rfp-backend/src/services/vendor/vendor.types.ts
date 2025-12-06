import { Vendor } from '../../database/vendor.schema';

export interface IVendorService {
  addVendor(name: string, email: string, category: string): Promise<Vendor>;
  listVendors(): Promise<Vendor[]>;
}


