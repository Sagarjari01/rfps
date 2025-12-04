import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RfpModule } from './modules/rfp/rfp.module';
import { VendorModule } from './modules/vendor/vendor.module';
import { ProposalModule } from './modules/proposal/proposal.module';
import { AiModule } from './common/ai/ai.module';
import { EmailModule } from './common/email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    AiModule,
    EmailModule,
    RfpModule,
    VendorModule,
    ProposalModule,
  ],
})
export class AppModule {}
