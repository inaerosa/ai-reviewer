import { Body, Controller, Post, Headers } from '@nestjs/common';
import { CodeReviewerService } from './code-reviewer.service';

@Controller('code-reviewer')
export class CodeReviewerController {
  constructor(private readonly codeReviewerService: CodeReviewerService) {}

  @Post('/webhook')
  async handleGitHubWebhook(
    @Body() body: any,
    @Headers('x-github-event') githubEvent: string,
  ): Promise<{ message: string }> {
    if (githubEvent === 'pull_request') {
      if (body.action === 'opened')
        await this.codeReviewerService.getGitHubData(body);
    }

    return { message: 'Webhook received' };
  }
}
