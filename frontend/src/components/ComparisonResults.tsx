import React from 'react';
import { CheckCircle, XCircle, Eye, Clock } from 'lucide-react';
import { CompareResult, XmlDifference } from '../types/xml-compare.types';

interface ComparisonResultsProps {
  result: CompareResult;
  title?: string;
  onShowSideBySide?: () => void;
}

export const ComparisonResults: React.FC<ComparisonResultsProps> = ({
  result,
  onShowSideBySide,
}) => {
  const getDifferenceTypeColor = (type: XmlDifference['type']): string => {
    switch (type) {
      case 'attribute':
        return 'attribute';
      case 'element':
        return 'element';
      case 'text':
        return 'text';
      case 'structure':
        return 'structure';
      default:
        return 'text';
    }
  };

  return (
    <div className={`result-card ${result.isMatch ? '' : 'failed'}`}>
      <div className="result-header">
        <div className="result-status">
          {result.isMatch ? (
            <>
              <CheckCircle size={20} />
              <span className="pass">PASS</span>
            </>
          ) : (
            <>
              <XCircle size={20} />
              <span className="fail">FAIL</span>
            </>
          )}
        </div>
        <div className="match-ratio">
          {result.matchRatio.toFixed(1)}% Match
        </div>
      </div>
      
      <div className="processing-time">
        <Clock size={14} />
        Processing time: {result.processingTime}ms
      </div>

      {result.differences.length > 0 && (
        <div className="differences-list">
          <h4>Differences Found ({result.differences.length})</h4>
          {result.differences.map((difference, index) => (
            <div key={index} className={`difference-item ${difference.ignored ? 'ignored' : ''}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={`difference-type ${getDifferenceTypeColor(difference.type)}`}>
                  {difference.type}
                </span>
                {difference.ignored && (
                  <span style={{ 
                    fontSize: '0.75rem', 
                    color: '#6b7280', 
                    backgroundColor: '#f3f4f6',
                    padding: '0.125rem 0.375rem',
                    borderRadius: '0.25rem',
                    fontStyle: 'italic'
                  }}>
                    IGNORED
                  </span>
                )}
              </div>
              <div className="difference-path">{difference.path}</div>
              <div className="difference-values">
                {difference.value1 && (
                  <div className="difference-value removed">
                    <strong>Value 1:</strong> {difference.value1}
                  </div>
                )}
                {difference.value2 && (
                  <div className="difference-value added">
                    <strong>Value 2:</strong> {difference.value2}
                  </div>
                )}
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                {difference.description}
                {difference.ignored && (
                  <span style={{ fontStyle: 'italic', color: '#9ca3af' }}>
                    {' '}(This difference was ignored by your settings)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {onShowSideBySide && (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button
            className="btn btn-secondary"
            onClick={onShowSideBySide}
          >
            <Eye size={16} />
            View Side by Side
          </button>
        </div>
      )}
    </div>
  );
}; 