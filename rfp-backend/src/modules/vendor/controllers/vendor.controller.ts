import { Controller, Post, Get, Body, Inject } from '@nestjs/common';
import { IVendorManager, IVendorManagerToken } from '../managers/vendor.manager.interface';

@Controller('vendors')
export class VendorController {
  constructor(
    @Inject(IVendorManagerToken) private readonly vendorManager: IVendorManager
  ) {}

  @Post()
  async create(@Body() body: { name: string; email: string; category: string }) {
    return this.vendorManager.addVendor(body.name, body.email, body.category);
  }

  @Get()
  async findAll() {
    return this.vendorManager.listVendors();
  }
}

