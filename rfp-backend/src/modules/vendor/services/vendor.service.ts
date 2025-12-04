import { Injectable } from '@nestjs/common';
import { IVendorManager } from '../managers/vendor.manager.interface';
import { VendorRepository } from '../repositories/vendor.repository';
import { Vendor } from '../schemas/vendor.schema';

@Injectable()
export class VendorService implements IVendorManager {
  constructor(private readonly vendorRepository: VendorRepository) {}

  async addVendor(name: string, email: string, category: string): Promise<Vendor> {
    return this.vendorRepository.create({ name, email, category });
  }

  async listVendors(): Promise<Vendor[]> {
    return this.vendorRepository.findAll();
  }
}

