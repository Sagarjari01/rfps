import { Module, Global } from '@nestjs/common';
import { AiService } from './ai.service';

@Global() // Key Step: Makes AI available everywhere without importing it repeatedly
@Module({
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}

