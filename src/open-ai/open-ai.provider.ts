import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

export const OPENAI_INSTANCE = Symbol('openai-instance');

export const OpenAiProvider: Provider = {
  provide: OPENAI_INSTANCE,
  useFactory: (config: ConfigService) => {
    return new OpenAI({
      apiKey: config.get<string>('OPEN_AI_KEY'),
    });
  },
  inject: [ConfigService],
};
