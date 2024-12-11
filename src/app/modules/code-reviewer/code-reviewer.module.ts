import { Module } from '@nestjs/common';
import { CodeReviewerController } from './code-reviewer.controller';
import { CodeReviewerService } from './code-reviewer.service';

@Module({
  imports: [],
  controllers: [CodeReviewerController],
  providers: [CodeReviewerService],
})
export class CodeReviewerModule {}
