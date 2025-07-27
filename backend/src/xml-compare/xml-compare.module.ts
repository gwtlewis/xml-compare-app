import { Module } from '@nestjs/common';
import { XmlCompareController } from './controllers/xml-compare.controller';
import { XmlCompareService } from './services/xml-compare.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [XmlCompareController],
  providers: [XmlCompareService],
  exports: [XmlCompareService],
})
export class XmlCompareModule {} 