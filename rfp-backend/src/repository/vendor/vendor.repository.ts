import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../common/repository/base.repository';
import { Vendor, VendorDocument } from '../../database/vendor.schema';
import { IVendorRepositoryManager } from './vendor.manager';

@Injectable()
export class VendorRepository extends BaseRepository<VendorDocument> implements IVendorRepositoryManager {
  constructor(@InjectModel(Vendor.name) private vendorModel: Model<VendorDocument>) {
    super(vendorModel);
  }
}

