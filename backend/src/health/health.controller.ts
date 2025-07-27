import { Controller, Get } from '@nestjs/common';

interface HealthResponse {
  isAvailable: boolean;
  componentName: string;
  timestamp: string;
  version: string;
  environment: string;
  projectUrl: string;
  status: 'healthy' | 'unhealthy';
  uptime: number;
}

@Controller('health')
export class HealthController {
  private readonly startTime = Date.now();

  @Get()
  getHealth(): HealthResponse {
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);
    
    return {
      isAvailable: true,
      componentName: 'XML Compare API',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      projectUrl: 'https://github.com/gwtlewis/xml-compare-app',
      status: 'healthy',
      uptime: uptime,
    };
  }
}