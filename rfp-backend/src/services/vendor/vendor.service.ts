import { Injectable, Inject } from '@nestjs/common';
import { IVendorManager } from './vendor.manager';
import { IVendorRepositoryManager, IVendorRepositoryManagerToken } from '../../repository/vendor/vendor.manager';
import { Vendor } from '../../database/vendor.schema';

@Injectable()
export class VendorService implements IVendorManager {
  constructor(
    @Inject(IVendorRepositoryManagerToken) private readonly vendorRepository: IVendorRepositoryManager
  ) {}

  async addVendor(name: string, email: string, category: string): Promise<Vendor> {
    return this.vendorRepository.create({ name, email, category });
  }

  async listVendors(): Promise<Vendor[]> {
    return this.vendorRepository.findAll();
  }
}

