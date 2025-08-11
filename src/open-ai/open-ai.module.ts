import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenAiProvider } from './open-ai.provider';

@Module({
  imports: [ConfigModule],
  providers: [OpenAiProvider],
  exports: [OpenAiProvider],
})
export class OpenAiModule {}
