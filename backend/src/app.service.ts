import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Word } from './database/entities/word.entity';
import { Repository } from 'typeorm';
import { Ollama } from 'ollama';

@Injectable()
export class AppService {
  ollamaClient = new Ollama({ host: 'http://127.0.0.1:1234' });

  constructor(
    @InjectRepository(Word) private wordRepository: Repository<Word>,
  ) {}

  async analyzeText(text: string): Promise<any> {
    const whiteList = (await this.wordRepository.find({ where: { type: 0 } }))
      .map((word) => word.text)
      .join(', ');
    const blackList = (await this.wordRepository.find({ where: { type: 1 } }))
      .map((word) => word.text)
      .join(', ');

    const prompt = `Analyze the following text and check for profanity:
    Text: "${text}"
    ${whiteList !== '' ? `Consider this list as a safe word list: ${whiteList}` : ''}
    ${blackList !== '' ? `Also consider this list of words that are not allowed: ${blackList}` : ''}
    Respond with a JSON object without any thinking process containing:
    - profanity: true/false
    - severity: 1..5 been 1 a low offense and 5 a high offense
    - masked_text: the input text with profanity masked`;
    console.log('Prompt for model:', prompt);

    try {
      const response = await this.ollamaClient.generate({
        model: 'qwen3:8b',
        prompt,
        system: 'You are a helpful assistant that detects profanity in text.',
      });
      console.log({ response });

      const raw = response.response;
      if (raw && raw.includes('{')) {
        const data = JSON.parse(raw.substring(raw.indexOf('{') - 1).trim());
        return {
          codeStatus: 200,
          responseLLM: raw,
          result: {
            hasProfanity: data.profanity,
            severity: data.severity,
            maskedText: data.masked_text,
          },
        };
      } else {
        return {
          codeStatus: 200,
          responseLLM: raw,
          result: {
            hasProfanity: false,
            severity: 'low',
            maskedText: text,
          },
        };
      }
    } catch (error) {
      console.error('Error analyzing text:', { error });
      return {
        codeStatus: 500,
        message: 'Error analyzing text',
      };
    }
  }

  getRoot(): string {
    return JSON.stringify({
      statusCode: 200,
      app: 'Profanity Detection',
      version: '1.0.0',
    });
  }

  async getWhiteListWords(): Promise<any> {
    const list = (await this.wordRepository.find({ where: { type: 0 } })).map(
      (word) => word.text,
    );
    return {
      codeStatus: 200,
      list,
    };
  }

  async addWhiteListWord(word: string): Promise<any> {
    const newWord = this.wordRepository.create({ text: word, type: 0 });
    await this.wordRepository.save(newWord);
    return {
      codeStatus: 200,
      message: 'Word added to whitelist',
    };
  }

  async addBlackListWord(word: string): Promise<any> {
    const newWord = this.wordRepository.create({ text: word, type: 1 });
    await this.wordRepository.save(newWord);
    return {
      codeStatus: 200,
      message: 'Word added to blacklist',
    };
  }

  async removeWhiteListWord(word: string): Promise<any> {
    await this.wordRepository.delete({ text: word, type: 0 });
    return {
      codeStatus: 200,
      message: 'Word removed from whitelist',
    };
  }

  async removeBlackListWord(word: string): Promise<any> {
    await this.wordRepository.delete({ text: word, type: 1 });
    return {
      codeStatus: 200,
      message: 'Word removed from blacklist',
    };
  }

  async getBlackListWords(): Promise<any> {
    const list = (await this.wordRepository.find({ where: { type: 1 } })).map(
      (word) => word.text,
    );
    return {
      codeStatus: 200,
      list,
    };
  }
}
