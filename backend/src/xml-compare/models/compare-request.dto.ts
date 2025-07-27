import { IsString, IsOptional, IsArray, IsNumber, Min, Max } from 'class-validator';

export class CompareRequestDto {
  @IsString()
  xml1: string;

  @IsString()
  xml2: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ignoredProperties?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  threshold?: number;
}

export class BatchCompareRequestDto {
  @IsArray()
  comparisons: CompareRequestDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ignoredProperties?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  threshold?: number;
}

export class UrlCompareRequestDto {
  @IsString()
  url1: string;

  @IsString()
  url2: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ignoredProperties?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  threshold?: number;
} 