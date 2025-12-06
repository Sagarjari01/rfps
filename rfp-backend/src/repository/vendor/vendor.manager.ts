import { VendorDocument } from '../../database/vendor.schema';

export const IVendorRepositoryManagerToken = 'IVendorRepositoryManager';

export interface IVendorRepositoryManager {
  create(data: Partial<VendorDocument>): Promise<VendorDocument>;
  findAll(): Promise<VendorDocument[]>;
  findOne(filter: Record<string, any>): Promise<VendorDocument | null>;
}
