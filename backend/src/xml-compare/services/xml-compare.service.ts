import { Injectable, Logger } from '@nestjs/common';
import { XMLParser } from 'fast-xml-parser';
import {
  CompareResultDto,
  XmlDifferenceDto,
  BatchCompareResultDto,
} from '../models/compare-response.dto';
import { CompareRequestDto } from '../models/compare-request.dto';

interface XmlNode {
  [key: string]: unknown;
}

interface ComparisonOptions {
  ignoredProperties: string[];
  threshold: number;
}

@Injectable()
export class XmlCompareService {
  private readonly logger = new Logger(XmlCompareService.name);
  private readonly parser: XMLParser;

  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
      preserveOrder: true,
    });
  }

  /**
   * Compares two XML strings and returns the comparison result
   * @param xml1 - First XML string
   * @param xml2 - Second XML string
   * @param options - Comparison options
   * @returns CompareResultDto - Comparison result
   */
  async compareXml(
    xml1: string,
    xml2: string,
    options: ComparisonOptions,
  ): Promise<CompareResultDto> {
    const startTime = Date.now();
    
    try {
      const parsed1 = this.parseXml(xml1);
      const parsed2 = this.parseXml(xml2);
      
      const allDifferences = this.findDifferences(parsed1, parsed2, options.ignoredProperties);
      
      // Filter out ignored differences for match ratio calculation
      const nonIgnoredDifferences = allDifferences.filter(diff => !diff.ignored);
      const matchRatio = this.calculateMatchRatio(parsed1, parsed2, nonIgnoredDifferences);
      const isMatch = matchRatio >= options.threshold;
      
      const processingTime = Date.now() - startTime;
      
      this.logger.log(`XML comparison completed in ${processingTime}ms with ${matchRatio}% match ratio`);
      
      return {
        matchRatio,
        isMatch,
        differences: allDifferences, // Return all differences for better UX
        processingTime,
      };
    } catch (error) {
      this.logger.error(`Error comparing XML: ${error.message}`);
      throw new Error(`Failed to compare XML: ${error.message}`);
    }
  }

  /**
   * Compares multiple XML pairs in batch
   * @param comparisons - Array of comparison requests
   * @param options - Global comparison options
   * @returns BatchCompareResultDto - Batch comparison results
   */
  async compareBatch(
    comparisons: CompareRequestDto[],
    options: ComparisonOptions,
  ): Promise<BatchCompareResultDto> {
    const startTime = Date.now();
    const results: CompareResultDto[] = [];
    
    // Process comparisons in parallel for better performance
    const comparisonPromises = comparisons.map(async (comparison) => {
      const localOptions = {
        ignoredProperties: [...(comparison.ignoredProperties || []), ...options.ignoredProperties],
        threshold: comparison.threshold || options.threshold,
      };
      
      return this.compareXml(comparison.xml1, comparison.xml2, localOptions);
    });
    
    const batchResults = await Promise.all(comparisonPromises);
    results.push(...batchResults);
    
    const totalProcessingTime = Date.now() - startTime;
    const passedComparisons = results.filter((result) => result.isMatch).length;
    const averageMatchRatio = results.reduce((sum, result) => sum + result.matchRatio, 0) / results.length;
    
    return {
      results,
      summary: {
        totalComparisons: results.length,
        passedComparisons,
        failedComparisons: results.length - passedComparisons,
        averageMatchRatio: Math.round(averageMatchRatio * 100) / 100,
        totalProcessingTime,
      },
    };
  }

  /**
   * Parses XML string to object
   * @param xml - XML string to parse
   * @returns XmlNode - Parsed XML object
   */
  private parseXml(xml: string): XmlNode {
    try {
      const parsed = this.parser.parse(xml);
      return parsed[0] || parsed;
    } catch (error) {
      throw new Error(`Invalid XML format: ${error.message}`);
    }
  }



  /**
   * Compares two XML objects with proper handling of attributes and text content
   * @param obj1 - First XML object
   * @param obj2 - Second XML object
   * @param ignoredProperties - Properties to ignore
   * @returns XmlDifferenceDto[] - Array of differences
   */
  private findDifferences(
    obj1: XmlNode,
    obj2: XmlNode,
    ignoredProperties: string[],
  ): XmlDifferenceDto[] {
    const differences: XmlDifferenceDto[] = [];
    const processedPaths = new Set<string>();
    
    // Handle XML attributes first
    this.compareXmlAttributes(obj1, obj2, '', differences, ignoredProperties);
    
    // Then handle the main XML structure
    this.compareObjects(obj1, obj2, '', differences, processedPaths, ignoredProperties);
    
    return differences;
  }

  /**
   * Compares XML attributes specifically
   * @param obj1 - First XML object
   * @param obj2 - Second XML object
   * @param path - Current path
   * @param differences - Array to store differences
   * @param ignoredProperties - Properties to ignore
   */
  private compareXmlAttributes(
    obj1: XmlNode,
    obj2: XmlNode,
    path: string,
    differences: XmlDifferenceDto[],
    ignoredProperties: string[],
  ): void {
    // Handle attributes stored in :@ object
    const attrs1 = (obj1 as any)[':@'] || {};
    const attrs2 = (obj2 as any)[':@'] || {};
    
    const attrKeys1 = Object.keys(attrs1);
    const attrKeys2 = Object.keys(attrs2);
    
    // Helper function to check if an attribute should be ignored
    const shouldIgnoreAttribute = (attrName: string, currentPath: string): boolean => {
      // Remove @_ prefix for comparison
      const cleanName = attrName.replace('@_', '');
      
      // Check if the attribute name is ignored
      if (ignoredProperties.includes(cleanName)) {
        return true;
      }
      
      // Check if the full path is ignored
      const fullPath = currentPath ? `${currentPath}.${cleanName}` : cleanName;
      if (ignoredProperties.includes(fullPath)) {
        return true;
      }
      
      return false;
    };
    
    // Check for missing attributes
    for (const attrKey of attrKeys1) {
      if (!attrKeys2.includes(attrKey)) {
        const isIgnored = shouldIgnoreAttribute(attrKey, path);
        differences.push({
          type: 'attribute',
          path: path ? `${path}.${attrKey.replace('@_', '')}` : attrKey.replace('@_', ''),
          value1: String(attrs1[attrKey]),
          description: 'Attribute missing in second object',
          ignored: isIgnored,
        });
      }
    }
    
    for (const attrKey of attrKeys2) {
      if (!attrKeys1.includes(attrKey)) {
        const isIgnored = shouldIgnoreAttribute(attrKey, path);
        differences.push({
          type: 'attribute',
          path: path ? `${path}.${attrKey.replace('@_', '')}` : attrKey.replace('@_', ''),
          value2: String(attrs2[attrKey]),
          description: 'Attribute missing in first object',
          ignored: isIgnored,
        });
      }
    }
    
    // Compare common attributes
    for (const attrKey of attrKeys1) {
      if (attrKeys2.includes(attrKey)) {
        const attrValue1 = attrs1[attrKey];
        const attrValue2 = attrs2[attrKey];
        
        if (attrValue1 !== attrValue2) {
          const isIgnored = shouldIgnoreAttribute(attrKey, path);
          differences.push({
            type: 'attribute',
            path: path ? `${path}.${attrKey.replace('@_', '')}` : attrKey.replace('@_', ''),
            value1: String(attrValue1),
            value2: String(attrValue2),
            description: 'Attribute values differ',
            ignored: isIgnored,
          });
        }
      }
    }
    
    // Recursively check attributes in child elements
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    for (const key of keys1) {
      if (keys2.includes(key) && key !== ':@' && typeof obj1[key] === 'object' && obj1[key] !== null) {
        const newPath = path ? `${path}.${key}` : key;
        this.compareXmlAttributes(
          obj1[key] as XmlNode,
          obj2[key] as XmlNode,
          newPath,
          differences,
          ignoredProperties,
        );
      }
    }
  }

  /**
   * Recursively compares two objects
   * @param obj1 - First object
   * @param obj2 - Second object
   * @param path - Current path in XML
   * @param differences - Array to store differences
   * @param processedPaths - Set of processed paths
   * @param ignoredProperties - Properties to ignore
   */
  private compareObjects(
    obj1: unknown,
    obj2: unknown,
    path: string,
    differences: XmlDifferenceDto[],
    processedPaths: Set<string>,
    ignoredProperties: string[],
  ): void {
    if (processedPaths.has(path)) {
      return;
    }
    processedPaths.add(path);
    
    // Handle null/undefined cases
    if (obj1 === null || obj1 === undefined) {
      if (obj2 !== null && obj2 !== undefined) {
        differences.push({
          type: 'structure',
          path,
          value1: 'null',
          value2: String(obj2),
          description: 'First object is null/undefined, second is not',
        });
      }
      return;
    }
    
    if (obj2 === null || obj2 === undefined) {
      differences.push({
        type: 'structure',
        path,
        value1: String(obj1),
        value2: 'null',
        description: 'Second object is null/undefined, first is not',
      });
      return;
    }
    
    // Handle primitive types
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
      if (obj1 !== obj2) {
        differences.push({
          type: 'text',
          path,
          value1: String(obj1),
          value2: String(obj2),
          description: 'Values differ',
        });
      }
      return;
    }
    
    // Handle text content (#text)
    if (this.isTextContent(obj1) || this.isTextContent(obj2)) {
      const text1 = this.extractTextContent(obj1);
      const text2 = this.extractTextContent(obj2);
      
      if (text1 !== text2) {
        differences.push({
          type: 'text',
          path,
          value1: text1,
          value2: text2,
          description: 'Text content differs',
        });
      }
      return;
    }
    
    // Handle arrays
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      this.compareArrays(obj1, obj2, path, differences, processedPaths, ignoredProperties);
      return;
    }
    
    // Handle objects
    if (Array.isArray(obj1) || Array.isArray(obj2)) {
      differences.push({
        type: 'structure',
        path,
        value1: Array.isArray(obj1) ? 'array' : 'object',
        value2: Array.isArray(obj2) ? 'array' : 'object',
        description: 'Type mismatch: array vs object',
      });
      return;
    }
    
    const keys1 = Object.keys(obj1 as XmlNode);
    const keys2 = Object.keys(obj2 as XmlNode);
    
    // Helper function to check if a property should be ignored
    const shouldIgnoreProperty = (propertyName: string, currentPath: string): boolean => {
      // Check if the property name itself is ignored
      if (ignoredProperties.includes(propertyName)) {
        return true;
      }
      
      // Check if the full path is ignored (e.g., "metadata.created")
      const fullPath = currentPath ? `${currentPath}.${propertyName}` : propertyName;
      if (ignoredProperties.includes(fullPath)) {
        return true;
      }
      
      // Check if any parent path is ignored
      const pathParts = fullPath.split('.');
      for (let i = 1; i < pathParts.length; i++) {
        const parentPath = pathParts.slice(0, i).join('.');
        if (ignoredProperties.includes(parentPath)) {
          return true;
        }
      }
      
      return false;
    };
    
    // Check for missing keys
    for (const key of keys1) {
      if (!keys2.includes(key)) {
        const isIgnored = shouldIgnoreProperty(key, path);
        differences.push({
          type: 'element',
          path: path ? `${path}.${key}` : key,
          value1: String((obj1 as XmlNode)[key]),
          description: 'Key missing in second object',
          ignored: isIgnored,
        });
      }
    }
    
    for (const key of keys2) {
      if (!keys1.includes(key)) {
        const isIgnored = shouldIgnoreProperty(key, path);
        differences.push({
          type: 'element',
          path: path ? `${path}.${key}` : key,
          value2: String((obj2 as XmlNode)[key]),
          description: 'Key missing in first object',
          ignored: isIgnored,
        });
      }
    }
    
    // Compare common keys
    for (const key of keys1) {
      if (keys2.includes(key)) {
        const newPath = path ? `${path}.${key}` : key;
        this.compareObjects(
          (obj1 as XmlNode)[key],
          (obj2 as XmlNode)[key],
          newPath,
          differences,
          processedPaths,
          ignoredProperties,
        );
      }
    }
  }

  /**
   * Checks if an object represents text content
   * @param obj - Object to check
   * @returns boolean - True if it's text content
   */
  private isTextContent(obj: unknown): boolean {
    if (typeof obj === 'object' && obj !== null) {
      const keys = Object.keys(obj as object);
      return keys.length === 1 && keys[0] === '#text';
    }
    return false;
  }

  /**
   * Extracts text content from an object
   * @param obj - Object to extract text from
   * @returns string - Extracted text content
   */
  private extractTextContent(obj: unknown): string {
    if (this.isTextContent(obj)) {
      return String((obj as any)['#text']);
    }
    return String(obj);
  }

  /**
   * Compares two arrays
   * @param arr1 - First array
   * @param arr2 - Second array
   * @param path - Current path
   * @param differences - Array to store differences
   * @param processedPaths - Set of processed paths
   * @param ignoredProperties - Properties to ignore
   */
  private compareArrays(
    arr1: unknown[],
    arr2: unknown[],
    path: string,
    differences: XmlDifferenceDto[],
    processedPaths: Set<string>,
    ignoredProperties: string[],
  ): void {
    if (arr1.length !== arr2.length) {
      differences.push({
        type: 'structure',
        path,
        value1: String(arr1.length),
        value2: String(arr2.length),
        description: 'Array lengths differ',
      });
    }
    
    const maxLength = Math.max(arr1.length, arr2.length);
    for (let i = 0; i < maxLength; i++) {
      const newPath = `${path}[${i}]`;
      this.compareObjects(
        arr1[i],
        arr2[i],
        newPath,
        differences,
        processedPaths,
        ignoredProperties,
      );
    }
  }

  /**
   * Calculates match ratio based on differences
   * @param obj1 - First XML object
   * @param obj2 - Second XML object
   * @param differences - Array of differences
   * @returns number - Match ratio (0-100)
   */
  private calculateMatchRatio(
    obj1: XmlNode,
    obj2: XmlNode,
    differences: XmlDifferenceDto[],
  ): number {
    const totalElements = this.countElements(obj1) + this.countElements(obj2);
    if (totalElements === 0) {
      return 100;
    }
    
    const differenceWeight = differences.length * 2; // Each difference affects both objects
    const matchRatio = Math.max(0, 100 - (differenceWeight / totalElements) * 100);
    
    return Math.round(matchRatio * 100) / 100;
  }

  /**
   * Counts total elements in an XML object
   * @param obj - XML object to count
   * @returns number - Total element count
   */
  private countElements(obj: unknown): number {
    if (obj === null || obj === undefined) {
      return 0;
    }
    
    if (typeof obj !== 'object') {
      return 1;
    }
    
    if (Array.isArray(obj)) {
      return obj.reduce((count, item) => count + this.countElements(item), 0);
    }
    
    return Object.keys(obj as XmlNode).reduce(
      (count, key) => count + this.countElements((obj as XmlNode)[key]),
      0,
    );
  }
} 