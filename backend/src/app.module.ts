import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { XmlCompareModule } from './xml-compare/xml-compare.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CoreModule,
    SharedModule,
    XmlCompareModule,
    HealthModule,
  ],
})
export class AppModule {} 