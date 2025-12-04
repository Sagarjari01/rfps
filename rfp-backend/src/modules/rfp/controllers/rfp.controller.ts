import { Controller, Post, Get, Body, Param, Inject } from '@nestjs/common';
import { IRfpManager, IRfpManagerToken } from '../managers/rfp.manager.interface';

@Controller('rfps')
export class RfpController {
  constructor(
    @Inject(IRfpManagerToken) private readonly rfpManager: IRfpManager
  ) {}

  @Post()
  async createRfp(@Body('text') text: string) {
    return this.rfpManager.createFromNL(text);
  }

  @Get()
  async getRfps() {
    return this.rfpManager.getAll();
  }

  @Post(':id/send')
  async sendRfp(
    @Param('id') id: string,
    @Body() body: { vendorIds: string[] }
  ) {
    return this.rfpManager.sendToVendors(id, body.vendorIds);
  }
}

