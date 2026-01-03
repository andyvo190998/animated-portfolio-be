import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(@Req() req: Request, @Res() res: Response) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Messages array is required' });
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const streamResponse = await this.chatService.streamChat(messages);

      // Set headers for streaming
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Transfer-Encoding', 'chunked');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Pipe the stream to the response
      const reader = streamResponse.body?.getReader();
      if (!reader) {
        return res.status(500).json({ error: 'Failed to create stream' });
      }

      const pump = async () => {
        const { done, value } = await reader.read();
        if (done) {
          res.end();
          return;
        }
        res.write(value);
        return pump();
      };

      await pump();
    } catch (error) {
      console.error('Chat error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
