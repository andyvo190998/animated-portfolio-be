import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { streamText, convertToModelMessages, UIMessage } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { RESUME_CONTEXT } from './chat.constants';

@Injectable()
export class ChatService {
  private openai;

  constructor(private configService: ConfigService) {
    this.openai = createOpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async streamChat(messages: UIMessage[]) {
    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      model: this.openai('gpt-4o-mini'),
      system: RESUME_CONTEXT,
      messages: modelMessages,
    });

    return result.toUIMessageStreamResponse();
  }
}
