import React, { useState } from 'react';
import type { JournalEntry } from '../types';
import { analyzeReflection } from '../utils/nlpAnalyzer';
import { Sparkles, BookOpen, Calendar, Trash2, Brain, Lightbulb, Filter } from 'lucide-react';
import { getTodayDateStr } from '../utils/storage';

interface JournalTabProps {
  entries: JournalEntry[];
  onAddJournal: (text: string, tags: string[]) => void;
  onDeleteJournal: (id: string) => void;
}

export const JournalTab: React.FC<JournalTabProps> = ({
  entries,
  onAddJournal,
  onDeleteJournal
}) => {
  const [text, setText] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Reflection']);
  const [searchFilter, setSearchFilter] = useState('');

  // Live NLP Preview as user types
  const liveAnalysis = analyzeReflection(text);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!selectedTags.includes(tagInput.trim())) {
        setSelectedTags([...selectedTags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddJournal(text.trim(), selectedTags);
    setText('');
    setSelectedTags(['Reflection']);
  };

  const filteredEntries = entries.filter(entry => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      entry.text.toLowerCase().includes(q) ||
      entry.analysis.dominantEmotion.toLowerCase().includes(q) ||
      entry.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="tab-content journal-tab">
      <div className="page-header">
        <div>
          <h1 className="page-title">AI Reflection Journal & Sentiment Analysis</h1>
          <p className="page-subtitle">Write daily reflections to run NLP sentiment scoring, uncover emotional patterns, and receive self-improvement tips.</p>
        </div>
        <div className="ai-badge-header">
          <Brain size={18} className="text-purple" />
          <span>NLP Sentiment Engine Active</span>
        </div>
      </div>

      <div className="journal-workspace-grid">
        {/* Editor Form */}
        <div className="card journal-editor-card">
          <div className="card-header">
            <div className="card-title-group">
              <BookOpen className="card-icon text-emerald" size={20} />
              <h2>New Daily Reflection Entry</h2>
            </div>
            <span className="date-pill">{getTodayDateStr()}</span>
          </div>

          <form onSubmit={handleSubmit} className="journal-form">
            <div className="input-group">
              <textarea
                placeholder="Share your thoughts, wins, or how you felt today... (e.g., 'Completed morning meditation and felt calm, but faced some pressure at work later.')"
                value={text}
                onChange={e => setText(e.target.value)}
                className="journal-textarea"
                rows={6}
                required
              />
            </div>

            {/* Tag Inputs */}
            <div className="input-group">
              <label className="input-label">Tags (Press Enter to add)</label>
              <div className="tags-input-container">
                {selectedTags.map(tag => (
                  <span key={tag} className="tag-chip">
                    #{tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="tag-remove-btn">×</button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="tag-bare-input"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={!text.trim()}>
              <Sparkles size={18} /> Analyze Sentiment & Save Reflection
            </button>
          </form>
        </div>

        {/* Real-time AI Sentiment Preview Panel */}
        <div className="card ai-analysis-panel">
          <div className="card-header">
            <div className="card-title-group">
              <Sparkles className="card-icon text-amber" size={20} />
              <h2>Live NLP Sentiment Analysis</h2>
            </div>
          </div>

          <div className="ai-analysis-body">
            {text.trim().length > 5 ? (
              <>
                <div className="sentiment-meter-group">
                  <div className="meter-label-row">
                    <span>Positivity Score</span>
                    <span className="score-number">
                      {liveAnalysis.score > 0 ? `+${liveAnalysis.score}` : liveAnalysis.score} / 10
                    </span>
                  </div>
                  <div className="sentiment-meter-track">
                    <div
                      className="sentiment-meter-bar"
                      style={{
                        width: `${Math.max(10, ((liveAnalysis.score + 10) / 20) * 100)}%`,
                        backgroundColor: liveAnalysis.score >= 2 ? '#10B981' : liveAnalysis.score <= -2 ? '#EF4444' : '#F59E0B'
                      }}
                    />
                  </div>
                </div>

                <div className="nlp-metrics-grid">
                  <div className="nlp-metric-box">
                    <span className="metric-title">Classification</span>
                    <span className="metric-val-pill">{liveAnalysis.label}</span>
                  </div>
                  <div className="nlp-metric-box">
                    <span className="metric-title">Dominant Emotion</span>
                    <span className="metric-val-pill emotion">{liveAnalysis.dominantEmotion}</span>
                  </div>
                </div>

                {liveAnalysis.keywords.length > 0 && (
                  <div className="keywords-box">
                    <span className="box-title">Extracted Sentiment Tokens:</span>
                    <div className="keywords-wrap">
                      {liveAnalysis.keywords.map(kw => (
                        <span key={kw} className="kw-badge">{kw}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="ai-insights-box">
                  <span className="box-title">
                    <Lightbulb size={16} className="text-amber" /> MindCare AI Self-Improvement Tips
                  </span>
                  <ul className="ai-tips-list">
                    {liveAnalysis.insights.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="empty-state-small">
                <Brain size={36} className="text-muted" />
                <p>Start typing your reflection in the editor to see real-time AI sentiment scoring and emotion classification!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reflection History Feed */}
      <div className="journal-history-section">
        <div className="history-header-row">
          <h2>Reflection History & Pattern Log ({entries.length})</h2>
          <div className="search-box">
            <Filter size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Search entry text, emotion, or tag..."
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="history-list">
          {filteredEntries.map(entry => (
            <div key={entry.id} className="card history-item-card">
              <div className="history-card-header">
                <div className="history-meta">
                  <Calendar size={15} className="text-muted" />
                  <span className="history-date">{entry.date}</span>
                  <span className="emotion-pill-badge">{entry.analysis.dominantEmotion}</span>
                  <span className={`score-badge ${entry.analysis.score >= 2 ? 'positive' : entry.analysis.score <= -2 ? 'negative' : 'neutral'}`}>
                    Score: {entry.analysis.score > 0 ? `+${entry.analysis.score}` : entry.analysis.score}
                  </span>
                </div>
                <button
                  className="icon-btn-delete"
                  onClick={() => onDeleteJournal(entry.id)}
                  title="Delete reflection"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <p className="history-entry-text">"{entry.text}"</p>

              {entry.analysis.insights.length > 0 && (
                <div className="history-ai-tip">
                  <Sparkles size={14} className="text-purple" />
                  <span>{entry.analysis.insights[0]}</span>
                </div>
              )}

              <div className="history-tags-row">
                {entry.tags.map(t => (
                  <span key={t} className="history-tag">#{t}</span>
                ))}
              </div>
            </div>
          ))}

          {filteredEntries.length === 0 && (
            <div className="empty-state-large card">
              <BookOpen size={40} className="text-muted" />
              <p>No journal reflections found matching your search filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
