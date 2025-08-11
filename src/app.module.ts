import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { OpenAiModule } from './open-ai/open-ai.module';



@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), OpenAiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
