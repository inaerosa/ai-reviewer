import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { reviewerPrompt } from 'src/core/prompts/reviewer';

@Injectable()
export class CodeReviewerService implements OnModuleInit {
  private octokit: any;
  private genAI: GoogleGenerativeAI;
  private model: any;

  private readonly logger = new Logger(CodeReviewerService.name);

  constructor(private readonly configService: ConfigService) {
    this.genAI = new GoogleGenerativeAI(
      this.configService.get<string>('GEMINI_API_KEY'),
    );
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async onModuleInit() {
    try {
      const { Octokit } = await import('@octokit/rest');
      this.octokit = new Octokit({
        auth: this.configService.get<string>('OKTOKIT_KEY'),
      });
      this.logger.log('Octokit initialized');
    } catch (error) {
      this.logger.error('Error initializing Octokit:', error);
    }
  }

  async getGitHubData(webhookData: any): Promise<void> {
    try {
      const [owner, repo] = webhookData.repository.full_name.split('/');

      const pullRequestNumber = webhookData.number;
      const { data: diffContent } = await this.octokit.pulls.get({
        owner,
        repo,
        pull_number: pullRequestNumber,
        mediaType: {
          format: 'diff',
        },
      });

      const prompt = reviewerPrompt.replace('{diff}', diffContent);

      const result = await this.model.generateContent(prompt, {
        max_tokens: 200,
        temperature: 0.5,
      });

      await this.octokit.pulls.createReview({
        owner,
        repo,
        pull_number: pullRequestNumber,
        body: result.response.text(),
        event: 'COMMENT',
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
