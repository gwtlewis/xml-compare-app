export interface XmlDifference {
  type: 'attribute' | 'element' | 'text' | 'structure';
  path: string;
  value1?: string;
  value2?: string;
  description: string;
  ignored?: boolean; // Whether this difference was ignored by settings
}

export interface CompareResult {
  matchRatio: number;
  isMatch: boolean;
  differences: XmlDifference[];
  processingTime: number;
}

export interface BatchCompareResult {
  results: CompareResult[];
  summary: {
    totalComparisons: number;
    passedComparisons: number;
    failedComparisons: number;
    averageMatchRatio: number;
    totalProcessingTime: number;
  };
}

export interface CompareRequest {
  xml1: string;
  xml2: string;
  ignoredProperties?: string[];
  threshold?: number;
}

export interface BatchCompareRequest {
  comparisons: CompareRequest[];
  ignoredProperties?: string[];
  threshold?: number;
}

export interface UrlCompareRequest {
  url1: string;
  url2: string;
  ignoredProperties?: string[];
  threshold?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export type ComparisonMode = 'text' | 'url' | 'file' | 'batch'; 