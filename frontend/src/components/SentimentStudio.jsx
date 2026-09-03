import React from 'react';
import './SentimentStudio.css';
import { generatePdfReport } from '../services/pdfGenerator';
import { useApp } from '../context/AppContext';

export const SentimentStudio = ({ analysisData, transcriptText, duration = 0, onSaveSession }) => {
  const { showToast, requireAuth } = useApp();
  const { sentiment, emotions, speechDelivery, executiveSummary } = analysisData || {};

  const handleCopy = () => {
    if (!transcriptText) return;
    navigator.clipboard.writeText(transcriptText);
    showToast('Transcript copied to clipboard!', 'success');
  };

  const handleExportPdf = () => {
    if (!analysisData || analysisData.isEmpty) {
      showToast('No analysis data available to export.', 'warning');
      return;
    }
    requireAuth(() => {
      generatePdfReport(analysisData, transcriptText, 'Speech Analysis Session');
      showToast('Analytical PDF report downloaded!', 'success');
    }, 'Please sign in or use the 1-click demo to export full PDF reports.');
  };


  if (!analysisData || analysisData.isEmpty) {
    return (
      <div className="sentiment-empty-panel aki-card">
        <div className="empty-seal">🌸</div>
        <h3>Voice & Sentiment Intelligence</h3>
        <p>Your emotion radar, speech pace telemetry, executive summary, and AI coach insights will appear here in real-time as you speak or load an audio track.</p>
        <div className="empty-features-list">
          <span>✨ AI Executive Summary</span>
          <span>✨ 6-Factor Emotion Radar</span>
          <span>✨ Words Per Minute (WPM)</span>
          <span>✨ Filler Word Tracker</span>
          <span>✨ Smart Delivery Coach</span>
        </div>
      </div>
    );
  }

  // Determine sentiment badge color and icon
  let polarityColor = 'var(--matcha-green)';
  let polarityIcon = '🌸';
  let toneBadge = 'Balanced & Harmonious';

  if (sentiment.polarity === 'positive') {
    polarityColor = 'var(--matcha-green)';
    polarityIcon = '🌸';
    toneBadge = sentiment.score >= 5 ? 'Highly Inspiring & Uplifting' : 'Positive & Engaging';
  } else if (sentiment.polarity === 'negative') {
    polarityColor = 'var(--maple-crimson)';
    polarityIcon = '🥀';
    toneBadge = sentiment.score <= -5 ? 'Urgent & Highly Critical' : 'Concerned & Critical';
  } else {
    polarityColor = 'var(--ginkgo-gold)';
    polarityIcon = '✨';
    toneBadge = 'Neutral & Objective';
  }

  // Calculate SVG circular stroke
  const strokeDashoffset = 283 - (283 * (sentiment.confidence || 75)) / 100;

  return (
    <div className="sentiment-studio-wrapper">
      {/* 1. Primary Polarity Executive Card */}
      <div className="aki-card polarity-executive-card">
        <div className="card-top-row">
          <div className="sentiment-tag" style={{ color: polarityColor, borderColor: polarityColor }}>
            {polarityIcon} {sentiment.label}
          </div>
          <div className="hanko-tone-badge">
            <span className="badge-tag">TONE</span>
            <span>{toneBadge}</span>
          </div>
        </div>

        {/* Circular Gauge + Metric Readouts */}
        <div className="polarity-center-display">
          <div className="circular-gauge-wrapper">
            <svg className="circular-gauge-svg" viewBox="0 0 100 100">
              <circle className="gauge-bg" cx="50" cy="50" r="45" />
              <circle
                className="gauge-fill"
                cx="50"
                cy="50"
                r="45"
                style={{
                  stroke: polarityColor,
                  strokeDashoffset
                }}
              />
            </svg>
            <div className="gauge-text-center">
              <span className="gauge-pct">{sentiment.confidence}%</span>
              <span className="gauge-sub">Confidence</span>
            </div>
          </div>

          <div className="polarity-metric-grid">
            <div className="metric-box">
              <span className="metric-label">Polarity Classification</span>
              <span className="metric-value" style={{ color: polarityColor }}>
                {sentiment.polarity.toUpperCase()}
              </span>
            </div>
            <div className="metric-box">
              <span className="metric-label">Raw Heuristic Score</span>
              <span className="metric-value">{sentiment.score > 0 ? `+${sentiment.score}` : sentiment.score}</span>
            </div>
            <div className="metric-box">
              <span className="metric-label">Comparative Score</span>
              <span className="metric-value">{sentiment.comparative}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Speech Delivery Telemetry Grid */}
      <div className="delivery-telemetry-grid">
        <div className="aki-card telemetry-card">
          <div className="telemetry-icon maple">⏱️</div>
          <div className="telemetry-info">
            <span className="telemetry-label">Speaking Pace</span>
            <span className="telemetry-main">{speechDelivery.wpm} <small>WPM</small></span>
            <span className="telemetry-sub">{speechDelivery.paceLabel}</span>
          </div>
        </div>

        <div className="aki-card telemetry-card">
          <div className="telemetry-icon amber">💬</div>
          <div className="telemetry-info">
            <span className="telemetry-label">Filler Words</span>
            <span className="telemetry-main" style={{ color: speechDelivery.fillerCount > 3 ? 'var(--maple-crimson)' : 'var(--ginkgo-gold)' }}>
              {speechDelivery.fillerCount} <small>({speechDelivery.fillerRatio}%)</small>
            </span>
            <span className="telemetry-sub">e.g. um, uh, like</span>
          </div>
        </div>

        <div className="aki-card telemetry-card">
          <div className="telemetry-icon matcha">📖</div>
          <div className="telemetry-info">
            <span className="telemetry-label">Readability</span>
            <span className="telemetry-main">{speechDelivery.readability.score} <small>/100</small></span>
            <span className="telemetry-sub">{speechDelivery.readability.level}</span>
          </div>
        </div>

        <div className="aki-card telemetry-card">
          <div className="telemetry-icon ginkgo">🌱</div>
          <div className="telemetry-info">
            <span className="telemetry-label">Vocabulary Diversity</span>
            <span className="telemetry-main">{speechDelivery.diversityRatio}%</span>
            <span className="telemetry-sub">{speechDelivery.uniqueWords} / {speechDelivery.totalWords} words</span>
          </div>
        </div>
      </div>

      {/* 3. 6-Factor Emotion Radar Bars */}
      <div className="aki-card emotion-radar-card">
        <div className="emotion-card-header">
          <div className="title-group">
            <span className="badge-tag">EMOTION RADAR</span>
            <h4>6-Factor Vocal Emotion Breakdown</h4>
          </div>
        </div>

        <div className="emotion-bars-container">
          <div className="emotion-bar-item">
            <div className="bar-label-group">
              <span>🎉 Joy & Enthusiasm</span>
              <strong>{emotions.joy}%</strong>
            </div>
            <div className="bar-track">
              <div className="bar-fill fill-joy" style={{ width: `${emotions.joy}%` }} />
            </div>
          </div>

          <div className="emotion-bar-item">
            <div className="bar-label-group">
              <span>🎯 Confidence</span>
              <strong>{emotions.confidence}%</strong>
            </div>
            <div className="bar-track">
              <div className="bar-fill fill-confidence" style={{ width: `${emotions.confidence}%` }} />
            </div>
          </div>

          <div className="emotion-bar-item">
            <div className="bar-label-group">
              <span>🌿 Serenity & Balance</span>
              <strong>{emotions.serenity}%</strong>
            </div>
            <div className="bar-track">
              <div className="bar-fill fill-serenity" style={{ width: `${emotions.serenity}%` }} />
            </div>
          </div>

          <div className="emotion-bar-item">
            <div className="bar-label-group">
              <span>⚡ Energy & Drive</span>
              <strong>{emotions.energy}%</strong>
            </div>
            <div className="bar-track">
              <div className="bar-fill fill-energy" style={{ width: `${emotions.energy}%` }} />
            </div>
          </div>

          <div className="emotion-bar-item">
            <div className="bar-label-group">
              <span>🤔 Hesitation & Doubt</span>
              <strong>{emotions.hesitation}%</strong>
            </div>
            <div className="bar-track">
              <div className="bar-fill fill-hesitation" style={{ width: `${emotions.hesitation}%` }} />
            </div>
          </div>

          <div className="emotion-bar-item">
            <div className="bar-label-group">
              <span>🔥 Frustration & Urgency</span>
              <strong>{emotions.frustration}%</strong>
            </div>
            <div className="bar-track">
              <div className="bar-fill fill-frustration" style={{ width: `${emotions.frustration}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* 4. AI Speech Delivery Coach & Actionable Recommendations */}
      <div className="aki-card ai-coach-card">
        <div className="ai-coach-header">
          <div className="coach-title-group">
            <span className="badge-tag">AI COACH</span>
            <h4>Smart Delivery & Speech Recommendations</h4>
          </div>
          <span className="coach-score-pill">
            🎯 Impact Rating: <strong>{Math.round(((emotions.confidence + emotions.joy + (100 - emotions.hesitation)) / 3))}%</strong>
          </span>
        </div>

        <div className="coach-insights-list">
          {/* Insight 1: Pacing */}
          <div className="coach-insight-item">
            <span className="insight-icon">
              {speechDelivery.wpm > 165 ? '⚡' : speechDelivery.wpm < 110 ? '🐢' : '✅'}
            </span>
            <div className="insight-content">
              <strong>Pacing & Cadence ({speechDelivery.wpm} WPM):</strong>
              <p>
                {speechDelivery.wpm > 165
                  ? 'Your pacing is brisk. Consider inserting brief pauses after key points to increase cognitive retention.'
                  : speechDelivery.wpm < 110
                  ? 'Your pacing is slow and deliberate. Good for technical concepts, but increase momentum for general presentations.'
                  : 'Excellent speaking rhythm. Your tempo is natural, clear, and easy for listeners to follow.'}
              </p>
            </div>
          </div>

          {/* Insight 2: Fillers */}
          <div className="coach-insight-item">
            <span className="insight-icon">
              {speechDelivery.fillerCount > 2 ? '⚠️' : '🌟'}
            </span>
            <div className="insight-content">
              <strong>Hesitation & Filler Control ({speechDelivery.fillerCount} detected):</strong>
              <p>
                {speechDelivery.fillerCount > 2
                  ? `Detected hesitation markers (${speechDelivery.fillerRatio}% of speech). Replace filler words with a steady breath pause.`
                  : 'High verbal precision. Very few filler words detected, projecting strong authority and clarity.'}
              </p>
            </div>
          </div>

          {/* Insight 3: Vocal Tone */}
          <div className="coach-insight-item">
            <span className="insight-icon">
              {sentiment.polarity === 'positive' ? '🌸' : sentiment.polarity === 'negative' ? '🥀' : '✨'}
            </span>
            <div className="insight-content">
              <strong>Emotional Resonance ({sentiment.label}):</strong>
              <p>
                {sentiment.polarity === 'positive'
                  ? 'High positive energy. Great enthusiasm and optimistic tonality that creates strong audience engagement.'
                  : sentiment.polarity === 'negative'
                  ? 'Serious and critical delivery. Effective for urgent problem-solving or constructive feedback.'
                  : 'Balanced and objective. Ideal for status reporting, factual reviews, and neutral debriefs.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. AI Executive Summary & Key Takeaways Card */}
      {executiveSummary && (
        <div className="aki-card ai-summary-card">
          <div className="summary-header">
            <div className="summary-title-group">
              <span className="badge-tag">AI SUMMARY</span>
              <h4>Executive Takeaways & Action Items</h4>
            </div>
            <span className="impact-pill">
              💡 {executiveSummary.impactRating}
            </span>
          </div>

          <div className="summary-synopsis-box">
            <span className="synopsis-label">Executive Synopsis</span>
            <p className="synopsis-text">{executiveSummary.synopsis}</p>
          </div>

          <div className="summary-themes-row">
            <span className="themes-label">Core Themes:</span>
            <div className="themes-pills">
              {executiveSummary.keyThemes.map((themeTag, idx) => (
                <span key={idx} className="theme-pill">
                  #{themeTag}
                </span>
              ))}
            </div>
          </div>

          <div className="summary-actions-box">
            <span className="actions-label">Recommended Next Steps:</span>
            <ul className="actions-list">
              {executiveSummary.actionItems.map((item, idx) => (
                <li key={idx}>
                  <span className="action-bullet">⚡</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 6. Action Bar */}
      <div className="sentiment-action-bar">
        <button onClick={handleExportPdf} className="aki-btn aki-btn-primary">
          📄 Download PDF Report
        </button>
        <button onClick={handleCopy} className="aki-btn aki-btn-secondary">
          📋 Copy Transcript
        </button>
        {onSaveSession && (
          <button onClick={onSaveSession} className="aki-btn aki-btn-gold">
            💾 Save to Archives
          </button>
        )}
      </div>
    </div>
  );
};
