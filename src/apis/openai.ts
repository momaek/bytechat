import type { ChatCompletionOptions, ChatCompletionResponse, ImageGenerationOptions, ImageGenerationResponse, Models } from '@/types/openai';
import axios from 'axios';
import type { AxiosInstance } from 'axios';

export class OpenAI {
  private readonly api: AxiosInstance;

  constructor(apiKey: string, baseURL?: string) {
    this.api = axios.create({
      baseURL: baseURL || 'https://one.zenbot.me/v1',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * 创建聊天完成 - 支持普通请求和流式请求
   */
  public async createChatCompletion(
    options: ChatCompletionOptions,
    onProgress?: (chunk: ChatCompletionResponse) => void
  ): Promise<ChatCompletionResponse> {
    if (!options.stream || !onProgress) {
      const response = await this.api.post<ChatCompletionResponse>(
        '/chat/completions',
        options
      );
      return response.data;
    }

    // 处理流式响应
    const response = await this.api.post('/chat/completions', options, {
      responseType: 'stream',
      headers: {
        Accept: 'text/event-stream',
      },
    });

    return new Promise((resolve, reject) => {
      let lastChunk: ChatCompletionResponse | undefined;
      
      const processLine = (line: string) => {
        // 移除 "data: " 前缀并解析 JSON
        const message = line.replace(/^data: /, '').trim();
        
        // 检查流是否结束
        if (message === '[DONE]') {
          if (lastChunk) {
            resolve(lastChunk);
          }
          return;
        }

        try {
          const chunk: ChatCompletionResponse = JSON.parse(message);
          lastChunk = chunk;
          onProgress(chunk);
        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      };

      let buffer = '';
      
      response.data.on('data', (chunk: Buffer) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        
        // 处理完整的行，保留最后一个不完整的行
        buffer = lines.pop() || '';
        lines.forEach(line => line.trim() && processLine(line));
      });

      response.data.on('end', () => {
        if (buffer.trim()) {
          processLine(buffer);
        }
        if (lastChunk) {
          resolve(lastChunk);
        } else {
          reject(new Error('No response data received'));
        }
      });

      response.data.on('error', (error: Error) => {
        reject(error);
      });
    });
  }

  /**
   * 获取可用模型列表
   */
  public async listModels(): Promise<Models> {
    const response = await this.api.get<Models>('/models');
    return response.data;
  }

  /**
   * 生成图像
   */
  public async createImage(
    options: ImageGenerationOptions
  ): Promise<ImageGenerationResponse> {
    const response = await this.api.post<ImageGenerationResponse>(
      '/images/generations',
      options
    );
    return response.data;
  }
}