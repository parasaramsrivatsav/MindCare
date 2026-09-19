import React, { useState } from 'react';
import type { MoodCheckIn, Habit, JournalEntry, MoodType } from '../types';
import { Sparkles, CheckCircle2, Circle, Flame, ArrowRight, Heart, Brain, Smile, Meh, Frown, Zap, AlertCircle } from 'lucide-react';
import { getTodayDateStr } from '../utils/storage';

interface DashboardTabProps {
  moods: MoodCheckIn[];
  onAddMood: (mood: MoodType, intensity: number, note: string) => void;
  habits: Habit[];
  onToggleHabitToday: (habitId: string) => void;
  latestJournal: JournalEntry | undefined;
  setActiveTab: (tab: string) => void;
}

const MOOD_OPTIONS: { type: MoodType; label: string; icon: any; color: string }[] = [
  { type: 'great', label: 'Great', icon: Smile, color: '#10B981' },
  { type: 'good', label: 'Good', icon: Zap, color: '#3B82F6' },
  { type: 'neutral', label: 'Neutral', icon: Meh, color: '#6B7280' },
  { type: 'stressed', label: 'Stressed', icon: AlertCircle, color: '#F59E0B' },
  { type: 'down', label: 'Down', icon: Frown, color: '#EF4444' }
];

export const DashboardTab: React.FC<DashboardTabProps> = ({
  moods,
  onAddMood,
  habits,
  onToggleHabitToday,
  latestJournal,
  setActiveTab
}) => {
  const todayStr = getTodayDateStr();
  const todayMood = moods.find(m => m.date === todayStr);

  const [selectedMood, setSelectedMood] = useState<MoodType>(todayMood ? todayMood.mood : 'good');
  const [intensity, setIntensity] = useState<number>(todayMood ? todayMood.intensity : 7);
  const [note, setNote] = useState<string>(todayMood ? todayMood.note || '' : '');
  const [submitted, setSubmitted] = useState<boolean>(!!todayMood);

  const handleMoodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMood(selectedMood, intensity, note);
    setSubmitted(true);
  };

  const completedTodayCount = habits.filter(h => h.completedDates.includes(todayStr)).length;
  const habitsCompletionPercent = habits.length > 0 ? Math.round((completedTodayCount / habits.length) * 100) : 0;

  return (
    <div className="tab-content dashboard-tab">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <span className="welcome-tagline">✨ Mindful Progress & Wellness</span>
          <h1 className="welcome-heading">Welcome back to MindCare</h1>
          <p className="welcome-description">
            Track your habits, capture AI-analyzed reflections, and foster positive daily development.
          </p>
        </div>
        <div className="quick-stats-pills">
          <div className="stat-pill">
            <span className="stat-value">{completedTodayCount}/{habits.length}</span>
            <span className="stat-label">Habits Today</span>
          </div>
          <div className="stat-pill">
            <span className="stat-value">{habitsCompletionPercent}%</span>
            <span className="stat-label">Daily Goal</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Mood Check-In Widget */}
        <div className="card mood-card">
          <div className="card-header">
            <div className="card-title-group">
              <Heart className="card-icon text-emerald" size={20} />
              <h2>Daily Mood Check-In</h2>
            </div>
            {todayMood && <span className="status-badge-success">Logged Today</span>}
          </div>

          <form onSubmit={handleMoodSubmit} className="mood-form">
            <label className="input-label">How are you feeling right now?</label>
            <div className="mood-selector-grid">
              {MOOD_OPTIONS.map(opt => {
                const IconComponent = opt.icon;
                const isSelected = selectedMood === opt.type;
                return (
                  <button
                    type="button"
                    key={opt.type}
                    className={`mood-btn ${isSelected ? 'selected' : ''}`}
                    style={{ borderColor: isSelected ? opt.color : undefined }}
                    onClick={() => setSelectedMood(opt.type)}
                  >
                    <IconComponent size={24} style={{ color: opt.color }} />
                    <span className="mood-btn-label">{opt.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="intensity-slider-group">
              <div className="slider-label-row">
                <span>Energy & Intensity Level:</span>
                <span className="intensity-val">{intensity} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={e => setIntensity(Number(e.target.value))}
                className="range-slider"
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                placeholder="Optional brief reflection note (e.g., Great workout, peaceful morning)..."
                value={note}
                onChange={e => setNote(e.target.value)}
                className="text-input"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full">
              {submitted ? 'Update Mood Check-In' : 'Save Today\'s Mood'}
            </button>
          </form>
        </div>

        {/* AI Sentiment Reflection Overview Card */}
        <div className="card ai-overview-card">
          <div className="card-header">
            <div className="card-title-group">
              <Brain className="card-icon text-purple" size={20} />
              <h2>Latest AI Reflection Insight</h2>
            </div>
            <button className="text-link-btn" onClick={() => setActiveTab('journal')}>
              Journal <ArrowRight size={14} />
            </button>
          </div>

          {latestJournal ? (
            <div className="ai-insight-content">
              <div className="sentiment-header-row">
                <span className="sentiment-score-badge">
                  Positivity Score: <strong>{latestJournal.analysis.score > 0 ? `+${latestJournal.analysis.score}` : latestJournal.analysis.score}</strong> / 10
                </span>
                <span className="emotion-tag-pill">
                  {latestJournal.analysis.dominantEmotion}
                </span>
              </div>

              <blockquote className="journal-quote-preview">
                "{latestJournal.text.length > 130 ? latestJournal.text.substring(0, 130) + '...' : latestJournal.text}"
              </blockquote>

              <div className="ai-tip-box">
                <Sparkles size={16} className="text-amber" />
                <p>{latestJournal.analysis.insights[0] || 'Keep reflecting daily to build emotional self-awareness.'}</p>
              </div>
            </div>
          ) : (
            <div className="empty-state-small">
              <Sparkles size={32} className="text-purple" />
              <p>No journal entries yet today. Write a quick reflection to get AI sentiment analysis!</p>
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('journal')}>
                Write Journal Entry
              </button>
            </div>
          )}
        </div>

        {/* Today's Habits Quick Check-list */}
        <div className="card habits-quick-card">
          <div className="card-header">
            <div className="card-title-group">
              <CheckCircle2 className="card-icon text-cyan" size={20} />
              <h2>Today's Habit Checklist</h2>
            </div>
            <button className="text-link-btn" onClick={() => setActiveTab('habits')}>
              Manage All <ArrowRight size={14} />
            </button>
          </div>

          <div className="habits-quick-list">
            {habits.map(habit => {
              const isCompleted = habit.completedDates.includes(todayStr);
              return (
                <div key={habit.id} className={`habit-quick-item ${isCompleted ? 'completed' : ''}`}>
                  <button
                    className="habit-check-btn"
                    onClick={() => onToggleHabitToday(habit.id)}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={20} style={{ color: habit.color }} />
                    ) : (
                      <Circle size={20} className="text-muted" />
                    )}
                  </button>
                  <span className="habit-title-text">{habit.title}</span>
                  <div className="habit-streak-mini">
                    <Flame size={14} className="text-amber" />
                    <span>{habit.streak}d</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Affirmation Card */}
        <div className="card affirmation-card">
          <div className="affirmation-inner">
            <Sparkles size={24} className="affirmation-icon" />
            <h3>Daily Mindful Affirmation</h3>
            <p className="affirmation-quote">
              "Small positive actions repeated consistently create compounding transformation in well-being and inner clarity."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
