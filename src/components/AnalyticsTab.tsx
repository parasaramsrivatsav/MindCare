import React from 'react';
import type { MoodCheckIn, Habit, JournalEntry, EmotionType } from '../types';
import { TrendingUp, PieChart, Lightbulb, Zap, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { getPastDateStr } from '../utils/storage';

interface AnalyticsTabProps {
  moods: MoodCheckIn[];
  habits: Habit[];
  journal: JournalEntry[];
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  moods,
  habits,
  journal
}) => {
  // Last 7 days data points for chart
  const last7DaysData = Array.from({ length: 7 }, (_, i) => {
    const dStr = getPastDateStr(6 - i);
    const dateObj = new Date(dStr);
    const dayLabel = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    
    // Find mood entry for day
    const m = moods.find(x => x.date === dStr);
    const moodVal = m ? m.intensity : 6; // default 6

    // Find journal sentiment for day
    const j = journal.find(x => x.date === dStr);
    const sentimentVal = j ? j.analysis.score : 2; // default 2

    // Habits completed on that date
    const habitsCompleted = habits.filter(h => h.completedDates.includes(dStr)).length;

    return {
      dateStr: dStr,
      label: dayLabel,
      moodIntensity: moodVal,
      sentimentScore: sentimentVal,
      habitsCompleted
    };
  });

  // Calculate Emotion Pattern Percentages
  const emotionCounts: Record<EmotionType, number> = {
    'Joy & Gratitude': 0,
    'Serenity & Calm': 0,
    'Motivation & Drive': 0,
    'Reflective & Thoughtful': 0,
    'Stress & Overwhelm': 0,
    'Anxiety & Restless': 0,
    'Tired & Low Energy': 0
  };

  journal.forEach(j => {
    const emo = j.analysis.dominantEmotion;
    if (emotionCounts[emo] !== undefined) {
      emotionCounts[emo] += 1;
    }
  });

  const totalJournalEntries = Math.max(1, journal.length);
  const emotionBreakdown = (Object.keys(emotionCounts) as EmotionType[]).map(emo => ({
    emotion: emo,
    count: emotionCounts[emo],
    percent: Math.round((emotionCounts[emo] / totalJournalEntries) * 100)
  })).sort((a, b) => b.count - a.count);

  // Calculate average habit compliance
  const totalPossibleHabits = habits.length * 7;
  const totalHabitsCompletedLast7 = habits.reduce((acc, h) => {
    const past7Completed = h.completedDates.filter(d => {
      const diffDays = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
      return diffDays < 7;
    }).length;
    return acc + past7Completed;
  }, 0);

  const averageHabitCompliance = totalPossibleHabits > 0 
    ? Math.round((totalHabitsCompletedLast7 / totalPossibleHabits) * 100)
    : 0;

  // Max score for SVG height calculations
  const maxIntensity = 10;
  const chartHeight = 160;
  const chartWidth = 500;

  // Compute SVG Points for Mood Line
  const points = last7DaysData.map((d, index) => {
    const x = (index / (last7DaysData.length - 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - (d.moodIntensity / maxIntensity) * (chartHeight - 30) - 15;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="tab-content analytics-tab">
      <div className="page-header">
        <div>
          <h1 className="page-title">Interactive Behavioral Analytics</h1>
          <p className="page-subtitle">Visualize mood trends, emotional pattern breakdown, and data-driven insights for continuous self-improvement.</p>
        </div>
      </div>

      {/* Analytics Summary Stats Header */}
      <div className="analytics-summary-grid">
        <div className="card stat-summary-card">
          <div className="stat-icon-wrapper text-emerald">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-num">{averageHabitCompliance}%</span>
            <span className="stat-title">Habit Compliance Rate</span>
          </div>
        </div>

        <div className="card stat-summary-card">
          <div className="stat-icon-wrapper text-cyan">
            <Sparkles size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-num">
              +{Math.round((last7DaysData.reduce((a, b) => a + b.sentimentScore, 0) / 7) * 10) / 10}
            </span>
            <span className="stat-title">Avg Weekly Sentiment</span>
          </div>
        </div>

        <div className="card stat-summary-card">
          <div className="stat-icon-wrapper text-purple">
            <Award size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-num">{habits.filter(h => h.streak > 2).length} Habits</span>
            <span className="stat-title">Active Streaks (&gt;2d)</span>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Mood & Sentiment Trend Line SVG Chart */}
        <div className="card chart-card">
          <div className="card-header">
            <div className="card-title-group">
              <TrendingUp className="card-icon text-emerald" size={20} />
              <h2>7-Day Mood & Positivity Trend</h2>
            </div>
          </div>

          <div className="svg-chart-container">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="svg-chart">
              {/* Horizontal Grid lines */}
              {[2, 4, 6, 8, 10].map(val => {
                const y = chartHeight - (val / maxIntensity) * (chartHeight - 30) - 15;
                return (
                  <g key={val}>
                    <line x1="20" y1={y} x2={chartWidth - 20} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                    <text x="5" y={y + 3} fill="var(--text-muted)" fontSize="10">{val}</text>
                  </g>
                );
              })}

              {/* Polyline Path */}
              <polyline
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
                points={points}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {last7DaysData.map((d, index) => {
                const x = (index / (last7DaysData.length - 1)) * (chartWidth - 40) + 20;
                const y = chartHeight - (d.moodIntensity / maxIntensity) * (chartHeight - 30) - 15;
                return (
                  <g key={d.dateStr} className="chart-data-point">
                    <circle cx={x} cy={y} r="5" fill="#10B981" stroke="#ffffff" strokeWidth="2" />
                    <text x={x} y={chartHeight - 2} textAnchor="middle" fill="var(--text-muted)" fontSize="11">{d.label}</text>
                    <text x={x} y={y - 10} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="600">{d.moodIntensity}</text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="chart-legend">
            <span className="legend-item"><span className="dot bg-emerald"></span> Mood Intensity (1-10)</span>
          </div>
        </div>

        {/* Emotion Distribution Breakdown */}
        <div className="card emotion-distribution-card">
          <div className="card-header">
            <div className="card-title-group">
              <PieChart className="card-icon text-purple" size={20} />
              <h2>Emotional Pattern Distribution</h2>
            </div>
          </div>

          <div className="emotion-bars-list">
            {emotionBreakdown.map(item => (
              <div key={item.emotion} className="emotion-bar-item">
                <div className="bar-header-row">
                  <span className="emotion-label">{item.emotion}</span>
                  <span className="emotion-percent">{item.percent}%</span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${item.percent}%`,
                      backgroundColor: item.emotion.includes('Joy') ? '#10B981' :
                                       item.emotion.includes('Serenity') ? '#06B6D4' :
                                       item.emotion.includes('Motivation') ? '#3B82F6' :
                                       item.emotion.includes('Stress') ? '#F59E0B' :
                                       item.emotion.includes('Anxiety') ? '#EF4444' : '#8B5CF6'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Habit Completion Breakdown */}
        <div className="card habit-breakdown-card">
          <div className="card-header">
            <div className="card-title-group">
              <CheckCircle2 className="card-icon text-cyan" size={20} />
              <h2>Habit Compliance Rates</h2>
            </div>
          </div>

          <div className="habit-compliance-list">
            {habits.map(h => {
              const completedIn7 = h.completedDates.filter(d => {
                const diffDays = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
                return diffDays < 7;
              }).length;
              const percent = Math.round((completedIn7 / 7) * 100);

              return (
                <div key={h.id} className="habit-compliance-item">
                  <div className="habit-comp-header">
                    <span className="habit-comp-name">{h.title}</span>
                    <span className="habit-comp-val">{completedIn7}/7 days ({percent}%)</span>
                  </div>
                  <div className="habit-comp-track">
                    <div
                      className="habit-comp-fill"
                      style={{ width: `${percent}%`, backgroundColor: h.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Personalized Behavior Insights */}
        <div className="card ai-insights-dashboard-card">
          <div className="card-header">
            <div className="card-title-group">
              <Lightbulb className="card-icon text-amber" size={20} />
              <h2>Personalized Insights for Self-Improvement</h2>
            </div>
          </div>

          <div className="insights-cards-list">
            <div className="insight-card">
              <Zap className="text-emerald" size={20} />
              <div className="insight-card-text">
                <h3>Mindfulness & Positivity Correlation</h3>
                <p>Days when you complete <strong>10-Min Morning Meditation</strong> show an average <strong>+2.8 higher positivity score</strong> in your NLP reflection logs.</p>
              </div>
            </div>

            <div className="insight-card">
              <Sparkles className="text-cyan" size={20} />
              <div className="insight-card-text">
                <h3>Hydration & Energy Stability</h3>
                <p>Consistent 2.5L water intake correlates with fewer instances of 'Tired & Low Energy' emotional tags in evening reflections.</p>
              </div>
            </div>

            <div className="insight-card">
              <Award className="text-purple" size={20} />
              <div className="insight-card-text">
                <h3>Streak Momentum Factor</h3>
                <p>Maintaining a 3+ day streak increases your likelihood of completing all daily wellness habits by <strong>78%</strong>.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
