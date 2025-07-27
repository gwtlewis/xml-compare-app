import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class HttpService {
  private readonly logger = new Logger(HttpService.name);

  /**
   * Downloads content from a URL
   * @param url - The URL to download from
   * @returns Promise<string> - The downloaded content
   */
  async downloadContent(url: string): Promise<string> {
    try {
      this.logger.log(`Downloading content from: ${url}`);
      const response: AxiosResponse<string> = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'XML-Compare-App/1.0',
        },
      });
      
      this.logger.log(`Successfully downloaded ${response.data.length} characters from ${url}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to download content from ${url}: ${error.message}`);
      throw new Error(`Failed to download content from ${url}: ${error.message}`);
    }
  }

  /**
   * Validates if a string is a valid URL
   * @param url - The URL to validate
   * @returns boolean - True if valid URL
   */
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
} 