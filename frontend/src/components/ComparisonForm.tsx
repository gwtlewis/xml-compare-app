import React, { useState } from 'react';
import { Upload, Plus, Trash2, Code, Minus, Sparkles } from 'lucide-react';
import { ComparisonMode } from '../types/xml-compare.types';
import { formatXml, minifyXml, beautifyXml } from '../utils/xml.utils';

interface ComparisonFormProps {
  mode: ComparisonMode;
  xml1: string;
  xml2: string;
  url1: string;
  url2: string;
  onXml1Change: (value: string) => void;
  onXml2Change: (value: string) => void;
  onUrl1Change: (value: string) => void;
  onUrl2Change: (value: string) => void;
  onFileUpload: (file: File, isFirst: boolean) => Promise<void>;
  onBatchCompare: (comparisons: Array<{ xml1: string; xml2: string }>) => Promise<void>;
  file1Ref: React.RefObject<HTMLInputElement>;
  file2Ref: React.RefObject<HTMLInputElement>;
}

export const ComparisonForm: React.FC<ComparisonFormProps> = ({
  mode,
  xml1,
  xml2,
  url1,
  url2,
  onXml1Change,
  onXml2Change,
  onUrl1Change,
  onUrl2Change,
  onFileUpload,
  onBatchCompare,
  file1Ref,
  file2Ref,
}) => {
  const [batchComparisons, setBatchComparisons] = useState<Array<{ xml1: string; xml2: string }>>([
    { xml1: '', xml2: '' }
  ]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, isFirst: boolean): void => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file, isFirst);
    }
  };

  const handleFormatXml = (xml: string, isFirst: boolean): void => {
    try {
      const formatted = formatXml(xml);
      if (isFirst) {
        onXml1Change(formatted);
      } else {
        onXml2Change(formatted);
      }
    } catch (error) {
      alert(`Failed to format XML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleMinifyXml = (xml: string, isFirst: boolean): void => {
    try {
      const minified = minifyXml(xml);
      if (isFirst) {
        onXml1Change(minified);
      } else {
        onXml2Change(minified);
      }
    } catch (error) {
      alert(`Failed to minify XML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleBeautifyXml = (xml: string, isFirst: boolean): void => {
    try {
      const beautified = beautifyXml(xml, { indentSize: 2 });
      if (isFirst) {
        onXml1Change(beautified);
      } else {
        onXml2Change(beautified);
      }
    } catch (error) {
      alert(`Failed to beautify XML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const addBatchComparison = (): void => {
    setBatchComparisons([...batchComparisons, { xml1: '', xml2: '' }]);
  };

  const removeBatchComparison = (index: number): void => {
    if (batchComparisons.length > 1) {
      setBatchComparisons(batchComparisons.filter((_, i) => i !== index));
    }
  };

  const updateBatchComparison = (index: number, field: 'xml1' | 'xml2', value: string): void => {
    const updated = [...batchComparisons];
    updated[index][field] = value;
    setBatchComparisons(updated);
  };

  const handleBatchCompare = (): void => {
    const validComparisons = batchComparisons.filter(comp => comp.xml1.trim() && comp.xml2.trim());
    if (validComparisons.length > 0) {
      onBatchCompare(validComparisons);
    }
  };

  const renderXmlActions = (xml: string, isFirst: boolean, title: string): JSX.Element => (
    <div className="comparison-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h3>{title}</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn btn-secondary"
            onClick={() => handleFormatXml(xml, isFirst)}
            disabled={!xml.trim()}
            title="Format XML with proper indentation"
            style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
          >
            <Code size={12} />
            Format
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleMinifyXml(xml, isFirst)}
            disabled={!xml.trim()}
            title="Minify XML by removing whitespace"
            style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
          >
            <Minus size={12} />
            Minify
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleBeautifyXml(xml, isFirst)}
            disabled={!xml.trim()}
            title="Beautify XML with custom formatting"
            style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
          >
            <Sparkles size={12} />
            Beautify
          </button>
        </div>
      </div>
      <textarea
        className="form-input form-textarea"
        value={xml}
        onChange={(e) => isFirst ? onXml1Change(e.target.value) : onXml2Change(e.target.value)}
        placeholder={`Enter ${title.toLowerCase()}...`}
        style={{ minHeight: '400px' }}
      />
    </div>
  );

  const renderTextInput = (): JSX.Element => (
    <div className="card" style={{ padding: '1rem' }}>
      <div className="comparison-container">
        {renderXmlActions(xml1, true, 'XML Document 1')}
        {renderXmlActions(xml2, false, 'XML Document 2')}
      </div>
    </div>
  );

  const renderUrlInput = (): JSX.Element => (
    <div className="comparison-container">
      <div className="comparison-panel">
        <h3>URL 1</h3>
        <input
          type="url"
          className="form-input"
          value={url1}
          onChange={(e) => onUrl1Change(e.target.value)}
          placeholder="https://example.com/file1.xml"
        />
      </div>
      <div className="comparison-panel">
        <h3>URL 2</h3>
        <input
          type="url"
          className="form-input"
          value={url2}
          onChange={(e) => onUrl2Change(e.target.value)}
          placeholder="https://example.com/file2.xml"
        />
      </div>
    </div>
  );

  const renderFileUpload = (): JSX.Element => (
    <div className="comparison-container">
      <div className="comparison-panel">
        <h3>File 1</h3>
        <input
          ref={file1Ref}
          type="file"
          accept=".xml,.txt"
          onChange={(e) => handleFileChange(e, true)}
          style={{ display: 'none' }}
        />
        <button
          className="btn btn-secondary"
          onClick={() => file1Ref.current?.click()}
        >
          <Upload size={16} />
          Choose XML File
        </button>
        {xml1 && (
          <div className="xml-display">
            {xml1.substring(0, 200)}...
          </div>
        )}
      </div>
      <div className="comparison-panel">
        <h3>File 2</h3>
        <input
          ref={file2Ref}
          type="file"
          accept=".xml,.txt"
          onChange={(e) => handleFileChange(e, false)}
          style={{ display: 'none' }}
        />
        <button
          className="btn btn-secondary"
          onClick={() => file2Ref.current?.click()}
        >
          <Upload size={16} />
          Choose XML File
        </button>
        {xml2 && (
          <div className="xml-display">
            {xml2.substring(0, 200)}...
          </div>
        )}
      </div>
    </div>
  );

  const renderBatchInput = (): JSX.Element => (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Batch Comparisons</h2>
        <button
          className="btn btn-secondary"
          onClick={addBatchComparison}
        >
          <Plus size={16} />
          Add Comparison
        </button>
      </div>
      
      {batchComparisons.map((comparison, index) => (
        <div key={index} className="card" style={{ marginBottom: '1rem' }}>
          <div className="card-header">
            <h3>Comparison {index + 1}</h3>
            {batchComparisons.length > 1 && (
              <button
                className="btn btn-danger"
                onClick={() => removeBatchComparison(index)}
              >
                <Trash2 size={16} />
                Remove
              </button>
            )}
          </div>
          
          <div className="comparison-container">
            <div className="comparison-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h4>XML Document 1</h4>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      try {
                        const formatted = formatXml(comparison.xml1);
                        updateBatchComparison(index, 'xml1', formatted);
                      } catch (error) {
                        alert(`Failed to format XML: ${error instanceof Error ? error.message : 'Unknown error'}`);
                      }
                    }}
                    disabled={!comparison.xml1.trim()}
                    title="Format XML"
                  >
                    <Code size={12} />
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      try {
                        const minified = minifyXml(comparison.xml1);
                        updateBatchComparison(index, 'xml1', minified);
                      } catch (error) {
                        alert(`Failed to minify XML: ${error instanceof Error ? error.message : 'Unknown error'}`);
                      }
                    }}
                    disabled={!comparison.xml1.trim()}
                    title="Minify XML"
                  >
                    <Minus size={12} />
                  </button>
                </div>
              </div>
              <textarea
                className="form-input form-textarea"
                value={comparison.xml1}
                onChange={(e) => updateBatchComparison(index, 'xml1', e.target.value)}
                placeholder="Enter first XML document..."
              />
            </div>
            <div className="comparison-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h4>XML Document 2</h4>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      try {
                        const formatted = formatXml(comparison.xml2);
                        updateBatchComparison(index, 'xml2', formatted);
                      } catch (error) {
                        alert(`Failed to format XML: ${error instanceof Error ? error.message : 'Unknown error'}`);
                      }
                    }}
                    disabled={!comparison.xml2.trim()}
                    title="Format XML"
                  >
                    <Code size={12} />
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      try {
                        const minified = minifyXml(comparison.xml2);
                        updateBatchComparison(index, 'xml2', minified);
                      } catch (error) {
                        alert(`Failed to minify XML: ${error instanceof Error ? error.message : 'Unknown error'}`);
                      }
                    }}
                    disabled={!comparison.xml2.trim()}
                    title="Minify XML"
                  >
                    <Minus size={12} />
                  </button>
                </div>
              </div>
              <textarea
                className="form-input form-textarea"
                value={comparison.xml2}
                onChange={(e) => updateBatchComparison(index, 'xml2', e.target.value)}
                placeholder="Enter second XML document..."
              />
            </div>
          </div>
        </div>
      ))}
      
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <button
          className="btn btn-primary"
          onClick={handleBatchCompare}
        >
          Compare All
        </button>
      </div>
    </div>
  );

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          {mode === 'text' && 'Text Input'}
          {mode === 'url' && 'URL Download'}
          {mode === 'file' && 'File Upload'}
          {mode === 'batch' && 'Batch Comparison'}
        </h2>
      </div>
      
      {mode === 'text' && renderTextInput()}
      {mode === 'url' && renderUrlInput()}
      {mode === 'file' && renderFileUpload()}
      {mode === 'batch' && renderBatchInput()}
    </div>
  );
}; 