import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle, XCircle, Upload, Download, FileText, Globe } from 'lucide-react';
import { ComparisonMode, CompareResult, BatchCompareResult } from '../types/xml-compare.types';
import { apiService } from '../services/api.service';
import { isValidXml, isValidUrl, readFileContent } from '../utils/xml.utils';
import { loadUserPreferences, saveUserPreferences } from '../utils/storage.utils';
import { ComparisonForm } from './ComparisonForm';
import { ComparisonResults } from './ComparisonResults';
import { SideBySideView } from './SideBySideView';

export const XmlCompare: React.FC = () => {
  const [mode, setMode] = useState<ComparisonMode>('text');
  const [xml1, setXml1] = useState<string>('');
  const [xml2, setXml2] = useState<string>('');
  const [url1, setUrl1] = useState<string>('');
  const [url2, setUrl2] = useState<string>('');
  const [ignoredProperties, setIgnoredProperties] = useState<string[]>([]);
  const [threshold, setThreshold] = useState<number>(95); // Default to 95%
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<CompareResult | null>(null);
  const [batchResult, setBatchResult] = useState<BatchCompareResult | null>(null);
  const [error, setError] = useState<string>('');
  const [showSideBySide, setShowSideBySide] = useState<boolean>(false);
  
  const file1Ref = useRef<HTMLInputElement>(null);
  const file2Ref = useRef<HTMLInputElement>(null);

  // Load user preferences from browser storage on component mount
  useEffect(() => {
    const preferences = loadUserPreferences();
    setThreshold(preferences.matchThreshold);
    setIgnoredProperties(preferences.ignoredProperties);
    setMode(preferences.comparisonMode as ComparisonMode);
  }, []);

  // Save preferences to browser storage when they change
  const updateThreshold = (newThreshold: number) => {
    setThreshold(newThreshold);
    saveUserPreferences({ matchThreshold: newThreshold });
  };

  const updateIgnoredProperties = (newProperties: string[]) => {
    setIgnoredProperties(newProperties);
    saveUserPreferences({ ignoredProperties: newProperties });
  };

  const updateMode = (newMode: ComparisonMode) => {
    setMode(newMode);
    saveUserPreferences({ comparisonMode: newMode });
  };

  const handleFileUpload = async (file: File, isFirst: boolean): Promise<void> => {
    try {
      const content = await readFileContent(file);
      if (isFirst) {
        setXml1(content);
      } else {
        setXml2(content);
      }
    } catch (err) {
      setError('Failed to read file');
    }
  };

  const handleCompare = async (): Promise<void> => {
    setError('');
    setResult(null);
    setBatchResult(null);
    setIsLoading(true);

    try {
      let compareResult: CompareResult;

      if (mode === 'url') {
        if (!isValidUrl(url1) || !isValidUrl(url2)) {
          throw new Error('Please enter valid URLs');
        }
        compareResult = await apiService.compareFromUrls({
          url1,
          url2,
          ignoredProperties,
          threshold,
        });
      } else {
        if (!xml1.trim() || !xml2.trim()) {
          throw new Error('Please enter XML content for both sides');
        }
        if (!isValidXml(xml1) || !isValidXml(xml2)) {
          throw new Error('Please enter valid XML content');
        }
        compareResult = await apiService.compareXml({
          xml1,
          xml2,
          ignoredProperties,
          threshold,
        });
      }

      setResult(compareResult);
      setShowSideBySide(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Comparison failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchCompare = async (comparisons: Array<{ xml1: string; xml2: string }>): Promise<void> => {
    setError('');
    setResult(null);
    setBatchResult(null);
    setIsLoading(true);

    try {
      const batchResult = await apiService.compareBatch({
        comparisons,
        ignoredProperties,
        threshold,
      });
      setBatchResult(batchResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Batch comparison failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = (): void => {
    setXml1('');
    setXml2('');
    setUrl1('');
    setUrl2('');
    setResult(null);
    setBatchResult(null);
    setError('');
    setShowSideBySide(false);
  };

  return (
    <div>
      {/* Mode Selection - Compact */}
      <div className="card" style={{ padding: '1rem' }}>
        <div className="mode-tabs">
          <button
            className={`mode-tab ${mode === 'text' ? 'active' : ''}`}
            onClick={() => updateMode('text')}
          >
            <FileText size={16} />
            Text Input
          </button>
          <button
            className={`mode-tab ${mode === 'url' ? 'active' : ''}`}
            onClick={() => updateMode('url')}
          >
            <Globe size={16} />
            URL Download
          </button>
          <button
            className={`mode-tab ${mode === 'file' ? 'active' : ''}`}
            onClick={() => updateMode('file')}
          >
            <Upload size={16} />
            File Upload
          </button>
          <button
            className={`mode-tab ${mode === 'batch' ? 'active' : ''}`}
            onClick={() => updateMode('batch')}
          >
            <Download size={16} />
            Batch Compare
          </button>
        </div>
      </div>

      {/* Settings - Compact and Horizontal */}
      <div className="card" style={{ padding: '1rem' }}>
        <div className="settings-section">
          <div className="form-group">
            <label className="form-label">Ignored Properties (comma-separated)</label>
            <input
              type="text"
              className="form-input"
              value={ignoredProperties.join(', ')}
              onChange={(e) => updateIgnoredProperties(e.target.value.split(',').map(p => p.trim()).filter(Boolean))}
              placeholder="timestamp, id, version, metadata.created"
            />
            <small style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem', display: 'block' }}>
              Supports: element names, attributes, nested paths (e.g., metadata.created)
            </small>
          </div>
          
          <div className="form-group">
            <label className="form-label">Match Threshold (%)</label>
            <input
              type="number"
              className="form-input"
              value={threshold}
              onChange={(e) => updateThreshold(Number(e.target.value))}
              min="0"
              max="100"
            />
          </div>
        </div>
      </div>

      {/* Comparison Form - Main Content */}
      <div className="xml-comparison-section">
        <ComparisonForm
          mode={mode}
          xml1={xml1}
          xml2={xml2}
          url1={url1}
          url2={url2}
          onXml1Change={setXml1}
          onXml2Change={setXml2}
          onUrl1Change={setUrl1}
          onUrl2Change={setUrl2}
          onFileUpload={handleFileUpload}
          onBatchCompare={handleBatchCompare}
          file1Ref={file1Ref}
          file2Ref={file2Ref}
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="error">
          <XCircle size={16} />
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="loading">
          <div className="spinner"></div>
          Processing comparison...
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="results-container">
          <ComparisonResults result={result} />
          {showSideBySide && (
            <SideBySideView
              xml1={xml1}
              xml2={xml2}
              differences={result.differences}
              onClose={() => setShowSideBySide(false)}
            />
          )}
        </div>
      )}

      {/* Batch Results */}
      {batchResult && (
        <div className="results-container">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Batch Comparison Results</h2>
            </div>
            <div className="match-ratio">
              Average Match Ratio: {batchResult.summary.averageMatchRatio}%
            </div>
            <div className="processing-time">
              Total Processing Time: {batchResult.summary.totalProcessingTime}ms
            </div>
            <div>
              Passed: {batchResult.summary.passedComparisons}, 
              Failed: {batchResult.summary.failedComparisons}
            </div>
            {batchResult.results.map((result, index) => (
              <div key={index} className="result-card">
                <div className="result-header">
                  <span>Comparison {index + 1}</span>
                  <div className={`result-status ${result.isMatch ? 'pass' : 'fail'}`}>
                    {result.isMatch ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    {result.isMatch ? 'PASS' : 'FAIL'}
                  </div>
                </div>
                <div className="match-ratio">{result.matchRatio}%</div>
                <div className="processing-time">
                  Processing Time: {result.processingTime}ms
                </div>
                {result.differences.length > 0 && (
                  <div className="differences-list">
                    <h4>Differences ({result.differences.length})</h4>
                    {result.differences.map((diff, diffIndex) => (
                      <div key={diffIndex} className="difference-item">
                        <div className={`difference-type ${diff.type}`}>
                          {diff.type}
                        </div>
                        <div className="difference-path">{diff.path}</div>
                        <div className="difference-values">
                          {diff.value1 && (
                            <div className="difference-value removed">
                              <strong>Removed:</strong> {diff.value1}
                            </div>
                          )}
                          {diff.value2 && (
                            <div className="difference-value added">
                              <strong>Added:</strong> {diff.value2}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {mode !== 'batch' && (
        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              className="btn btn-primary"
              onClick={handleCompare}
              disabled={isLoading || (mode === 'text' && (!xml1.trim() || !xml2.trim())) || (mode === 'url' && (!url1.trim() || !url2.trim()))}
            >
              <CheckCircle size={16} />
              Compare XML
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleClear}
              disabled={isLoading}
            >
              <XCircle size={16} />
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 