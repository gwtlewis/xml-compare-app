/**
 * Validates if a string is valid XML
 * @param xml - XML string to validate
 * @returns boolean - True if valid XML
 */
export function isValidXml(xml: string): boolean {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    const parseError = doc.getElementsByTagName('parsererror');
    return parseError.length === 0;
  } catch {
    return false;
  }
}

/**
 * Formats XML string with proper indentation and structure
 * @param xml - XML string to format
 * @returns string - Formatted XML
 */
export function formatXml(xml: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    
    // Check for parsing errors
    const parseError = doc.getElementsByTagName('parsererror');
    if (parseError.length > 0) {
      throw new Error('Invalid XML format');
    }
    
    const serializer = new XMLSerializer();
    const formatted = serializer.serializeToString(doc);
    
    // Add proper indentation
    return addIndentation(formatted);
  } catch (error) {
    throw new Error(`Failed to format XML: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Adds proper indentation to XML string
 * @param xml - XML string without indentation
 * @returns string - XML with proper indentation
 */
function addIndentation(xml: string): string {
  const lines = xml.split('\n');
  const formattedLines: string[] = [];
  let indentLevel = 0;
  const indentSize = 2;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;
    
    // Decrease indent for closing tags
    if (trimmedLine.startsWith('</')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    // Add indentation
    const indent = ' '.repeat(indentLevel * indentSize);
    formattedLines.push(indent + trimmedLine);
    
    // Increase indent for opening tags (but not self-closing)
    if (trimmedLine.startsWith('<') && !trimmedLine.startsWith('</') && !trimmedLine.endsWith('/>')) {
      indentLevel++;
    }
  }
  
  return formattedLines.join('\n');
}

/**
 * Minifies XML by removing unnecessary whitespace
 * @param xml - XML string to minify
 * @returns string - Minified XML
 */
export function minifyXml(xml: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    
    // Check for parsing errors
    const parseError = doc.getElementsByTagName('parsererror');
    if (parseError.length > 0) {
      throw new Error('Invalid XML format');
    }
    
    const serializer = new XMLSerializer();
    return serializer.serializeToString(doc);
  } catch (error) {
    throw new Error(`Failed to minify XML: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Highlights differences in XML content with proper XML structure preservation
 * @param xml - XML string to highlight
 * @param differences - Array of differences to highlight
 * @returns string - HTML with highlighted differences
 */
export function highlightDifferences(xml: string, differences: Array<{ path: string; value1?: string; value2?: string; type: string }>): string {
  // First, format the XML for better readability
  let formattedXml = formatXml(xml);
  
  // Escape HTML entities to prevent XSS
  formattedXml = formattedXml
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  
  // Add basic XML syntax highlighting
  formattedXml = formattedXml
    .replace(/(&lt;\/?[a-zA-Z][a-zA-Z0-9]*)/g, '<span class="xml-tag">$1</span>')
    .replace(/([a-zA-Z-]+)=&quot;([^&]*?)&quot;/g, '<span class="xml-attribute">$1</span>=&quot;<span class="xml-value">$2</span>&quot;')
    .replace(/(&lt;!--.*?--&gt;)/g, '<span class="xml-comment">$1</span>');
  
  // Highlight differences
  differences.forEach((diff) => {
    if (diff.value1 && diff.value2) {
      // Escape the values for regex
      const escapedValue1 = diff.value1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const escapedValue2 = diff.value2.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Create regex patterns that match the values within XML tags
      const regex1 = new RegExp(`(&gt;)(${escapedValue1})(&lt;)`, 'g');
      const regex2 = new RegExp(`(&gt;)(${escapedValue2})(&lt;)`, 'g');
      
      // Replace with highlighted versions
      formattedXml = formattedXml.replace(regex1, `$1<span class="diff-removed">$2</span>$3`);
      formattedXml = formattedXml.replace(regex2, `$1<span class="diff-added">$2</span>$3`);
    }
  });
  
  // Convert newlines to <br> tags for proper display
  formattedXml = formattedXml.replace(/\n/g, '<br>');
  
  return formattedXml;
}

/**
 * Extracts file content from File object
 * @param file - File object
 * @returns Promise<string> - File content
 */
export function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const content = event.target?.result as string;
      resolve(content);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Validates if a string is a valid URL
 * @param url - URL to validate
 * @returns boolean - True if valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generates a unique ID
 * @returns string - Unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Beautifies XML with custom formatting options
 * @param xml - XML string to beautify
 * @param options - Formatting options
 * @returns string - Beautified XML
 */
export function beautifyXml(xml: string, options: {
  indentSize?: number;
  preserveWhitespace?: boolean;
  collapseEmptyElements?: boolean;
} = {}): string {
  const {
    indentSize = 2,
    preserveWhitespace = false,
    collapseEmptyElements = true
  } = options;
  
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    
    // Check for parsing errors
    const parseError = doc.getElementsByTagName('parsererror');
    if (parseError.length > 0) {
      throw new Error('Invalid XML format');
    }
    
    const serializer = new XMLSerializer();
    let formatted = serializer.serializeToString(doc);
    
    if (!preserveWhitespace) {
      // Remove extra whitespace
      formatted = formatted.replace(/\s+/g, ' ').trim();
    }
    
    if (collapseEmptyElements) {
      // Collapse empty elements
      formatted = formatted.replace(/<([^>]+)\s*\/>/g, '<$1/>');
    }
    
    // Add indentation
    const lines = formatted.split('\n');
    const formattedLines: string[] = [];
    let indentLevel = 0;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;
      
      // Decrease indent for closing tags
      if (trimmedLine.startsWith('</')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      // Add indentation
      const indent = ' '.repeat(indentLevel * indentSize);
      formattedLines.push(indent + trimmedLine);
      
      // Increase indent for opening tags (but not self-closing)
      if (trimmedLine.startsWith('<') && !trimmedLine.startsWith('</') && !trimmedLine.endsWith('/>')) {
        indentLevel++;
      }
    }
    
    return formattedLines.join('\n');
  } catch (error) {
    throw new Error(`Failed to beautify XML: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
} 