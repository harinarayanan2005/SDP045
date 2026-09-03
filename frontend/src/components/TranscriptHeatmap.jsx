import React, { useState } from 'react';
import './TranscriptHeatmap.css';

export const TranscriptHeatmap = ({ tokens = [], fullText = '' }) => {
  const [selectedWord, setSelectedWord] = useState(null);
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'positive', 'negative', 'filler'

  if (!tokens || tokens.length === 0) {
    return (
      <div className="transcript-heatmap-container empty">
        <div className="heatmap-empty-state">
          <span>🍂</span>
          <p>No speech or transcript text available yet. Start speaking or upload an audio file to see interactive sentiment highlights.</p>
        </div>
      </div>
    );
  }

  const positiveCount = tokens.filter(t => t.type === 'positive').length;
  const negativeCount = tokens.filter(t => t.type === 'negative').length;
  const fillerCount = tokens.filter(t => t.type === 'filler').length;

  return (
    <div className="transcript-heatmap-container">
      <div className="heatmap-header">
        <div className="heatmap-title">
          <span className="badge-tag">HIGHLIGHTS</span>
          <span>Interactive Transcript & Emotion Heatmap</span>
        </div>

        {/* Filter / Category Pills */}
        <div className="heatmap-filters">
          <button
            className={`filter-pill ${filterMode === 'all' ? 'active' : ''}`}
            onClick={() => setFilterMode('all')}
          >
            All ({tokens.length})
          </button>
          <button
            className={`filter-pill pill-pos ${filterMode === 'positive' ? 'active' : ''}`}
            onClick={() => setFilterMode('positive')}
          >
            🌸 Positive ({positiveCount})
          </button>
          <button
            className={`filter-pill pill-neg ${filterMode === 'negative' ? 'active' : ''}`}
            onClick={() => setFilterMode('negative')}
          >
            🍂 Negative ({negativeCount})
          </button>
          <button
            className={`filter-pill pill-filler ${filterMode === 'filler' ? 'active' : ''}`}
            onClick={() => setFilterMode('filler')}
          >
            🌾 Fillers ({fillerCount})
          </button>
        </div>
      </div>

      <div className="heatmap-text-flow">
        {tokens.map((token, idx) => {
          let className = 'heatmap-token';
          const isHighlighted = filterMode === 'all' || filterMode === token.type;

          if (token.type === 'positive') className += ' token-pos';
          else if (token.type === 'negative') className += ' token-neg';
          else if (token.type === 'filler') className += ' token-filler';
          else className += ' token-neutral';

          if (!isHighlighted) {
            className += ' token-dimmed';
          }

          return (
            <span
              key={`${token.original}-${idx}`}
              className={className}
              onClick={() => setSelectedWord(token)}
              title={token.labelTag ? `${token.labelTag}: ${token.original}` : token.original}
            >
              {token.original}{' '}
            </span>
          );
        })}
      </div>

      {selectedWord && (
        <div className="selected-token-card">
          <div className="token-card-header">
            <strong>Word Telemetry: "{selectedWord.original}"</strong>
            <button className="token-card-close" onClick={() => setSelectedWord(null)}>✕</button>
          </div>
          <div className="token-card-body">
            <span>Category: <strong>{selectedWord.labelTag || 'Standard Word'}</strong></span>
            <span>Position: #{selectedWord.index + 1}</span>
            <span>Sentiment Tag: <span className={`badge-${selectedWord.type}`}>{selectedWord.type.toUpperCase()}</span></span>
          </div>
        </div>
      )}
    </div>
  );
};
