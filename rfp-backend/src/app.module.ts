import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RfpController } from './controller/rfp.controller';
import { VendorController } from './controller/vendor.controller';
import { ProposalController } from './controller/proposal.controller';
import { HealthController } from './controller/health.controller';
import { RfpServiceModule } from './services/rfp/rfp.module';
import { VendorServiceModule } from './services/vendor/vendor.module';
import { ProposalServiceModule } from './services/proposal/proposal.module';
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
    RfpServiceModule,
    VendorServiceModule,
    ProposalServiceModule,
  ],
  controllers: [
    RfpController,
    VendorController,
    ProposalController,
    HealthController,
  ],
})
export class AppModule {}
