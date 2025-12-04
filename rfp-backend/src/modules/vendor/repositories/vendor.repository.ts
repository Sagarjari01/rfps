import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../../common/repository/base.repository';
import { Vendor, VendorDocument } from '../schemas/vendor.schema';

@Injectable()
export class VendorRepository extends BaseRepository<VendorDocument> {
  constructor(@InjectModel(Vendor.name) private vendorModel: Model<VendorDocument>) {
    super(vendorModel);
  }
}

