import { Keyword } from "./keyword";

export class GeneratedResponse{
    keywords: Keyword[];
    summary: string;
    topics: string[]

  static Create(summary: string, keywords: string[], topics: string[]) {
    const newGeneratedResponse = new GeneratedResponse();

    newGeneratedResponse.keywords = keywords.map(k => {
      const newKeyword = new Keyword();
      newKeyword.keyword = k;
      return newKeyword;
    });

    newGeneratedResponse.summary = summary;
    newGeneratedResponse.topics = topics;

    return newGeneratedResponse;
  }
}