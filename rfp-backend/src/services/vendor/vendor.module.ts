import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { IVendorManagerToken } from './vendor.manager';
import { VendorRepositoryModule } from '../../repository/vendor/vendor.module';

@Module({
  imports: [VendorRepositoryModule],
  providers: [
    VendorService,
    {
      provide: IVendorManagerToken,
      useClass: VendorService,
    },
  ],
  exports: [IVendorManagerToken, VendorService],
})
export class VendorServiceModule {}


