import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VendorController } from './controllers/vendor.controller';
import { VendorService } from './services/vendor.service';
import { VendorRepository } from './repositories/vendor.repository';
import { Vendor, VendorSchema } from './schemas/vendor.schema';
import { IVendorManagerToken } from './managers/vendor.manager.interface';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vendor.name, schema: VendorSchema }]),
  ],
  controllers: [VendorController],
  providers: [
    VendorRepository,
    {
      provide: IVendorManagerToken,
      useClass: VendorService,
    },
  ],
  exports: [IVendorManagerToken, VendorRepository], // Exporting so other modules can use it later
})
export class VendorModule {}

