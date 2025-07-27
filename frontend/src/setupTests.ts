// Jest setup file for frontend tests
import '@testing-library/jest-dom';

// Mock window.alert for tests
Object.defineProperty(window, 'alert', {
  writable: true,
  value: jest.fn(),
});

// Mock fetch for API tests
global.fetch = jest.fn();

// Mock DOMParser and XMLSerializer for XML utility tests
Object.defineProperty(window, 'DOMParser', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    parseFromString: jest.fn().mockImplementation((str: string, _type: string) => {
      // Simple mock implementation
      if (str.includes('<') && str.includes('>')) {
        const hasParseError = !str.includes('</') || str.includes('<root><item>test</item>');
        return {
          getElementsByTagName: (tagName: string) => hasParseError && tagName === 'parsererror' ? [{}] : [],
        };
      } else {
        return {
          getElementsByTagName: () => [{}], // Parse error exists
        };
      }
    }),
  })),
});

Object.defineProperty(window, 'XMLSerializer', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    serializeToString: jest.fn().mockImplementation((_doc: any) => '<?xml version="1.0"?><root><item>test</item></root>'),
  })),
});