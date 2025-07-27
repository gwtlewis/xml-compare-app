import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div>
          <h1>XML Compare</h1>
          <div className="header-subtitle">
            High-performance XML comparison tool with side-by-side diff view
          </div>
        </div>
      </div>
    </header>
  );
}; 