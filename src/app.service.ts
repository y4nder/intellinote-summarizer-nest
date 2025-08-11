import { Inject, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { OPENAI_INSTANCE } from './open-ai/open-ai.provider';
import z from 'zod';
import { zodTextFormat } from "openai/helpers/zod";
import { GeneratedResponse } from './dto/generated.response';

const KeywordSchema = z.object({
  keywords : z.array(z.string()).length(10)
})

const TopicSchema = z.object({
  topics: z.array(z.string())
})

@Injectable()
export class AppService {

  constructor(
    @Inject(OPENAI_INSTANCE)
    private readonly client: OpenAI
  ){}

  getHello(): string {
    return 'Hello World!';
  }

  async runGenerationPipeline(document: string){
    const summarization = await this.summarizeLargeDocument(document);
    const keywordExtraction = await this.extractKeywords(summarization + " " + document);
    const keywords = keywordExtraction!.keywords;
    const topicExtraction = await this.extractTopics(summarization, keywords);
    const topics = topicExtraction!.topics;
    return GeneratedResponse.Create(summarization, keywords, topics);
  }

  async debugSummarizer(document:string){
    return await this.summarizeLargeDocument(document);
  }

  private async summarizeLargeDocument(document: string) {
    const chunkSize = 3000;
    const chunks = this.splitIntoChunks(document, chunkSize);

    let finalSummary: string;

    if (chunks.length === 1) {
      finalSummary = await this.summarizeChunk(chunks[0]);
    } else {
      const chunkSummaries = await Promise.all(
        chunks.map(chunk => this.summarizeChunk(chunk))
      );

      finalSummary = await this.summarizeChunk(chunkSummaries.join(' '));
    }

    return finalSummary
      .replace(/\n+/g, ' ') 
      .replace(/\s+/g, ' ') 
      .trim();
  }


  private splitIntoChunks(text: string, chunkSize: number): string[] {
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
  }

  private async summarizeChunk(chunk: string): Promise<string> {
    const response = await this.client.responses.create({
      model: 'gpt-5-nano-2025-08-07',
      input: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that summarizes text into a single, concise paragraph of complete sentences. Avoid bullet points or lists.',
        },
        {
          role: 'user',
          content: `Summarize the following text into paragraph form:\n\n${chunk}`,
        },
      ],
    });

    return response.output_text;
  }

  async debugExtractKeywords(document: string){
    return this.extractKeywords(document);
  }

  private async extractKeywords(document: string){
    const response =  await this.client.responses.parse({
      model: "gpt-5-nano",
      input: [
        {
          role: "system",
          content: "You are an assistant that extracts exactly 10 of the most relevant and important keywords from a document. Return only keywords that are directly related to the document’s main topics."
        },{
          role: "user",
          content: document
        }
      ],
      text: {
        format: zodTextFormat(KeywordSchema, "extracted_keywords")
      }
    });

    return response.output_parsed;
  }

  private async extractTopics(summarized: string, keywords: string[]){
    const response = await this.client.responses.parse({
      model: "gpt-5-nano",
      input: [
        {
          role: "system",
          content: "You are a helpful assistant that generates concise topics."
        },
        {
          role: "user",
          content: `Keywords: ${keywords.join(", ")} Summary: ${summarized}`
        }
      ],
      text: {
        format: zodTextFormat(TopicSchema, "extracted_topics")
      }
    });

    return response.output_parsed;
  }
}
