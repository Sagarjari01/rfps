import { VendorDocument } from '../../database/vendor.schema';

export interface IVendorRepository {
  create(data: Partial<VendorDocument>): Promise<VendorDocument>;
  findAll(): Promise<VendorDocument[]>;
  findOne(filter: any): Promise<VendorDocument | null>;
}


