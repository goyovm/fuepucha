import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from './database/entities/word.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Word])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
