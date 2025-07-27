import React from 'react';
import { X, FileText } from 'lucide-react';
import { XmlDifference } from '../types/xml-compare.types';
import { highlightDifferences } from '../utils/xml.utils';

interface SideBySideViewProps {
  xml1: string;
  xml2: string;
  differences: XmlDifference[];
  onClose: () => void;
}

export const SideBySideView: React.FC<SideBySideViewProps> = ({
  xml1,
  xml2,
  differences,
  onClose,
}) => {
  const highlightedXml1 = highlightDifferences(xml1, differences);
  const highlightedXml2 = highlightDifferences(xml2, differences);

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <FileText size={20} />
          Side-by-Side Comparison
        </h2>
        <button
          className="btn btn-secondary"
          onClick={onClose}
        >
          <X size={16} />
          Close
        </button>
      </div>
      
      <div className="side-by-side-container">
        <div className="side-by-side-panel">
          <h3>XML Document 1</h3>
          <div
            className="side-by-side-content"
            dangerouslySetInnerHTML={{ __html: highlightedXml1 }}
          />
        </div>
        <div className="side-by-side-panel">
          <h3>XML Document 2</h3>
          <div
            className="side-by-side-content"
            dangerouslySetInnerHTML={{ __html: highlightedXml2 }}
          />
        </div>
      </div>
      
      <div style={{ 
        marginTop: '1rem', 
        padding: '1rem', 
        background: '#f8fafc', 
        borderRadius: '0.5rem',
        border: '1px solid #e2e8f0'
      }}>
        <h4 style={{ marginBottom: '0.75rem', fontSize: '0.875rem', fontWeight: '600' }}>Legend</h4>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="diff-removed" style={{ fontSize: '0.875rem' }}>Removed content</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="diff-added" style={{ fontSize: '0.875rem' }}>Added content</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#2563eb', fontSize: '0.875rem' }}>XML Tags</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#7c3aed', fontSize: '0.875rem' }}>Attributes</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 