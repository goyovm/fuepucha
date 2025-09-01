import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AddWordDto, AnalyzeTextDto } from './app.dtos';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getRoot(): string {
    return this.appService.getRoot();
  }

  @Get('whitelist')
  getWhiteListWords() {
    return this.appService.getWhiteListWords();
  }

  @Post('whitelist-add')
  addWhiteListWord(@Body() payload: AddWordDto) {
    return this.appService.addWhiteListWord(payload.word);
  }

  @Post('blacklist-add')
  addBlackListWord(@Body() payload: AddWordDto) {
    return this.appService.addBlackListWord(payload.word);
  }

  @Post('whitelist-remove')
  removeWhiteListWord(@Body() payload: AddWordDto) {
    return this.appService.removeWhiteListWord(payload.word);
  }

  @Post('blacklist-remove')
  removeBlackListWord(@Body() payload: AddWordDto) {
    return this.appService.removeBlackListWord(payload.word);
  }

  @Get('blacklist')
  getBlackListWords() {
    return this.appService.getBlackListWords();
  }

  @Post('analyze')
  analyzeText(@Body() payload: AnalyzeTextDto) {
    return this.appService.analyzeText(payload.text);
  }
}
