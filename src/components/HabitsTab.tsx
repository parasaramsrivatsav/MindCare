import React, { useState } from 'react';
import type { Habit, HabitCategory } from '../types';
import { Plus, Check, Flame, Trash2, Target } from 'lucide-react';
import { getPastDateStr, getTodayDateStr } from '../utils/storage';

interface HabitsTabProps {
  habits: Habit[];
  onToggleHabitDate: (habitId: string, dateStr: string) => void;
  onAddHabit: (title: string, category: HabitCategory, color: string, targetPerWeek: number) => void;
  onDeleteHabit: (habitId: string) => void;
}

const CATEGORIES: HabitCategory[] = ['Mindfulness', 'Fitness', 'Learning', 'Self-Care', 'Nutrition'];

const COLOR_OPTIONS = ['#10B981', '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'];

export const HabitsTab: React.FC<HabitsTabProps> = ({
  habits,
  onToggleHabitDate,
  onAddHabit,
  onDeleteHabit
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<HabitCategory>('Mindfulness');
  const [newColor, setNewColor] = useState('#10B981');
  const [newTarget, setNewTarget] = useState(7);

  // Last 7 days dates (0 = today, 6 = 6 days ago)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const dStr = getPastDateStr(6 - i);
    const dateObj = new Date(dStr);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'narrow' });
    const dayNum = dateObj.getDate();
    return { dateStr: dStr, dayName, dayNum, isToday: dStr === getTodayDateStr() };
  });

  const filteredHabits = selectedCategory === 'All' 
    ? habits 
    : habits.filter(h => h.category === selectedCategory);

  const handleSubmitNewHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddHabit(newTitle.trim(), newCategory, newColor, newTarget);
    setNewTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="tab-content habits-tab">
      <div className="page-header">
        <div>
          <h1 className="page-title">Habit Tracker & Lifestyle Formation</h1>
          <p className="page-subtitle">Build consistent positive routines with visual streak tracking and weekly progress matrix.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Add New Habit
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="category-filter-bar">
        <button
          className={`filter-chip ${selectedCategory === 'All' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('All')}
        >
          All Habits ({habits.length})
        </button>
        {CATEGORIES.map(cat => {
          const count = habits.filter(h => h.category === cat).length;
          return (
            <button
              key={cat}
              className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Habit Table / Grid */}
      <div className="card habits-matrix-card">
        <div className="matrix-header">
          <div className="matrix-col-habit">Habit Routine</div>
          <div className="matrix-col-days">
            {last7Days.map(d => (
              <div key={d.dateStr} className={`day-header-cell ${d.isToday ? 'today' : ''}`}>
                <span className="day-name">{d.dayName}</span>
                <span className="day-num">{d.dayNum}</span>
              </div>
            ))}
          </div>
          <div className="matrix-col-streak">Streak</div>
          <div className="matrix-col-action"></div>
        </div>

        <div className="matrix-body">
          {filteredHabits.map(habit => {
            const weeklyCompletions = last7Days.filter(d => habit.completedDates.includes(d.dateStr)).length;

            return (
              <div key={habit.id} className="matrix-row">
                <div className="matrix-col-habit">
                  <div className="habit-color-indicator" style={{ backgroundColor: habit.color }}></div>
                  <div className="habit-info">
                    <span className="habit-name">{habit.title}</span>
                    <span className="habit-meta">{habit.category} • Target: {habit.targetPerWeek}/wk ({weeklyCompletions} done)</span>
                  </div>
                </div>

                <div className="matrix-col-days">
                  {last7Days.map(d => {
                    const isDone = habit.completedDates.includes(d.dateStr);
                    return (
                      <button
                        key={d.dateStr}
                        className={`day-toggle-btn ${isDone ? 'checked' : ''}`}
                        style={{
                          backgroundColor: isDone ? habit.color : undefined,
                          borderColor: isDone ? habit.color : undefined
                        }}
                        onClick={() => onToggleHabitDate(habit.id, d.dateStr)}
                        title={`${habit.title} on ${d.dateStr}`}
                      >
                        {isDone && <Check size={14} className="check-icon" />}
                      </button>
                    );
                  })}
                </div>

                <div className="matrix-col-streak">
                  <div className="streak-tag" style={{ color: habit.color }}>
                    <Flame size={16} />
                    <span>{habit.streak} days</span>
                  </div>
                </div>

                <div className="matrix-col-action">
                  <button
                    className="icon-btn-delete"
                    onClick={() => onDeleteHabit(habit.id)}
                    title="Delete habit"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredHabits.length === 0 && (
            <div className="empty-state-large">
              <Target size={40} className="text-muted" />
              <p>No habits found in this category.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Habit Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Habit</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmitNewHabit} className="modal-form">
              <div className="input-group">
                <label className="input-label">Habit Name</label>
                <input
                  type="text"
                  placeholder="e.g., Read 15 mins, Drink 2L Water, Gratitude Journal"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="text-input"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as HabitCategory)}
                  className="select-input"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Weekly Frequency Target</label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={newTarget}
                  onChange={e => setNewTarget(Number(e.target.value))}
                  className="text-input"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Accent Color</label>
                <div className="color-options-row">
                  {COLOR_OPTIONS.map(c => (
                    <button
                      type="button"
                      key={c}
                      className={`color-circle ${newColor === c ? 'selected' : ''}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setNewColor(c)}
                    />
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
