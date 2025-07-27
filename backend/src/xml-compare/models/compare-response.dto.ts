export interface CompareResultDto {
  matchRatio: number;
  isMatch: boolean;
  differences: XmlDifferenceDto[];
  processingTime: number;
}

export interface XmlDifferenceDto {
  type: 'attribute' | 'element' | 'text' | 'structure';
  path: string;
  value1?: string;
  value2?: string;
  description: string;
  ignored?: boolean; // Whether this difference was ignored by settings
}

export interface BatchCompareResultDto {
  results: CompareResultDto[];
  summary: {
    totalComparisons: number;
    passedComparisons: number;
    failedComparisons: number;
    averageMatchRatio: number;
    totalProcessingTime: number;
  };
}

export interface CompareResponseDto {
  success: boolean;
  data: CompareResultDto;
  message?: string;
}

export interface BatchCompareResponseDto {
  success: boolean;
  data: BatchCompareResultDto;
  message?: string;
} 