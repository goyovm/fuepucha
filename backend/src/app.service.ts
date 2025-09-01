import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Word } from './database/entities/word.entity';
import { Repository } from 'typeorm';
import axios from 'axios';

@Injectable()
export class AppService {
  private readonly API_URL = 'http://127.0.0.1:1234/v1/chat/completions';

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
    - severity: low/medium/high
    - masked_text: the input text with profanity masked`;
    console.log('Prompt for model:', prompt);

    try {
      const res = await axios.post(this.API_URL, {
        model: 'model',
        messages: [
          {
            role: 'system',
            content:
              'Respond with a JSON object without any thinking process containing:',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: -1,
        stream: false,
        chat_template_kwargs: { enable_thinking: false },
      });

      const raw = res.data.choices[0].message.content;
      const data = JSON.parse(
        raw.substring(raw.indexOf('</think>') + 9).trim(),
      );
      return {
        codeStatus: 200,
        message: 'Text analyzed successfully',
        result: {
          hasProfanity: data.profanity,
          severity: data.severity,
          maskedText: data.masked_text,
        },
      };
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
