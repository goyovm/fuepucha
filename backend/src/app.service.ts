import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Word } from './database/entities/word.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Word) private wordRepository: Repository<Word>,
  ) {}

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

  async analyzeText(text: string): Promise<any> {
    console.log('Analyzing text:', text);
    return {
      codeStatus: 200,
      message: 'Text analyzed successfully',
      result: {
        hasProfanity: false,
        severity: 8,
        maskedText: 'hola ********',
      },
    };
  }
}
