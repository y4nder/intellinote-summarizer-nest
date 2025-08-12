import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { GenerationRequest } from './dto/generation.request';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHealth(): string {
    return "Healthy"
  }

  @Post("api/generate")
  async generate(@Body() body: GenerationRequest){
    const response = await this.appService.runGenerationPipeline(body.document);
    return response;
  }

  @Post("debug/summarize")
  async debugSummarize(@Body() body: GenerationRequest){
    const response = await this.appService.debugSummarizer(body.document);
    return response;
  }

  @Post("debug/keywords")
  async debugKeywords(@Body() body: GenerationRequest){
    const response = await this.appService.debugExtractKeywords(body.document);
    return response?.keywords;
  }
}
