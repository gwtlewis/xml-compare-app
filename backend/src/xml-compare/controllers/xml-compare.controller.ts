import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { XmlCompareService } from '../services/xml-compare.service';
import { HttpService } from '../../shared/services/http.service';
import {
  CompareRequestDto,
  BatchCompareRequestDto,
  UrlCompareRequestDto,
} from '../models/compare-request.dto';
import {
  CompareResponseDto,
  BatchCompareResponseDto,
} from '../models/compare-response.dto';

@Controller('api/xml-compare')
export class XmlCompareController {
  private readonly logger = new Logger(XmlCompareController.name);

  constructor(
    private readonly xmlCompareService: XmlCompareService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Compares two XML strings
   * @param request - Comparison request
   * @returns CompareResponseDto - Comparison result
   */
  @Post('compare')
  @HttpCode(HttpStatus.OK)
  async compareXml(@Body() request: CompareRequestDto): Promise<CompareResponseDto> {
    this.logger.log('Received single XML comparison request');
    
    const options = {
      ignoredProperties: request.ignoredProperties || [],
      threshold: request.threshold || 95,
    };
    
    const result = await this.xmlCompareService.compareXml(
      request.xml1,
      request.xml2,
      options,
    );
    
    return {
      success: true,
      data: result,
    };
  }

  /**
   * Compares multiple XML pairs in batch
   * @param request - Batch comparison request
   * @returns BatchCompareResponseDto - Batch comparison results
   */
  @Post('batch-compare')
  @HttpCode(HttpStatus.OK)
  async compareBatch(@Body() request: BatchCompareRequestDto): Promise<BatchCompareResponseDto> {
    this.logger.log(`Received batch comparison request with ${request.comparisons.length} comparisons`);
    
    const options = {
      ignoredProperties: request.ignoredProperties || [],
      threshold: request.threshold || 95,
    };
    
    const result = await this.xmlCompareService.compareBatch(
      request.comparisons,
      options,
    );
    
    return {
      success: true,
      data: result,
    };
  }

  /**
   * Compares XML files from URLs
   * @param request - URL comparison request
   * @returns CompareResponseDto - Comparison result
   */
  @Post('compare-urls')
  @HttpCode(HttpStatus.OK)
  async compareFromUrls(@Body() request: UrlCompareRequestDto): Promise<CompareResponseDto> {
    this.logger.log(`Received URL comparison request: ${request.url1} vs ${request.url2}`);
    
    // Validate URLs
    if (!this.httpService.isValidUrl(request.url1)) {
      throw new Error(`Invalid URL: ${request.url1}`);
    }
    
    if (!this.httpService.isValidUrl(request.url2)) {
      throw new Error(`Invalid URL: ${request.url2}`);
    }
    
    // Download XML content from URLs
    const [xml1, xml2] = await Promise.all([
      this.httpService.downloadContent(request.url1),
      this.httpService.downloadContent(request.url2),
    ]);
    
    const options = {
      ignoredProperties: request.ignoredProperties || [],
      threshold: request.threshold || 95,
    };
    
    const result = await this.xmlCompareService.compareXml(xml1, xml2, options);
    
    return {
      success: true,
      data: result,
    };
  }

  /**
   * Health check endpoint for smoke testing
   * @returns object - Health status
   */
  @Post('admin/test')
  @HttpCode(HttpStatus.OK)
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    this.logger.log('Health check requested');
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    };
  }
} 