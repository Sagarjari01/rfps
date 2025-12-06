import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Vendor, VendorSchema } from '../../database/vendor.schema';
import { VendorRepository } from './vendor.repository';
import { IVendorRepositoryManagerToken } from './vendor.manager';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vendor.name, schema: VendorSchema }]),
  ],
  providers: [
    VendorRepository,
    {
      provide: IVendorRepositoryManagerToken,
      useClass: VendorRepository,
    },
  ],
  exports: [IVendorRepositoryManagerToken, VendorRepository],
})
export class VendorRepositoryModule {}

