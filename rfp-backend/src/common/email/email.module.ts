import { Module, Global } from '@nestjs/common';
import { EmailService } from './email.service';
import { IEmailManagerToken } from './email.manager.interface';

@Global()
@Module({
  providers: [
    {
      provide: IEmailManagerToken,
      useClass: EmailService,
    },
  ],
  exports: [IEmailManagerToken],
})
export class EmailModule {}

