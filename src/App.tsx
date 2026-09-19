import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardTab } from './components/DashboardTab';
import { HabitsTab } from './components/HabitsTab';
import { JournalTab } from './components/JournalTab';
import { AnalyticsTab } from './components/AnalyticsTab';
import { CommunityTab } from './components/CommunityTab';

import type {
  Habit,
  JournalEntry,
  MoodCheckIn,
  CommunityPost,
  MoodType,
  HabitCategory,
  EmotionType
} from './types';

import {
  loadHabits,
  saveHabits,
  loadMoods,
  saveMoods,
  loadJournal,
  saveJournal,
  loadCommunity,
  saveCommunity,
  getTodayDateStr
} from './utils/storage';

import { analyzeReflection } from './utils/nlpAnalyzer';
import './App.css';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [habits, setHabits] = useState<Habit[]>(loadHabits);
  const [moods, setMoods] = useState<MoodCheckIn[]>(loadMoods);
  const [journal, setJournal] = useState<JournalEntry[]>(loadJournal);
  const [community, setCommunity] = useState<CommunityPost[]>(loadCommunity);

  // Sync state to local storage
  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  useEffect(() => {
    saveMoods(moods);
  }, [moods]);

  useEffect(() => {
    saveJournal(journal);
  }, [journal]);

  useEffect(() => {
    saveCommunity(community);
  }, [community]);

  // Compute total habit streak days across all active habits
  const totalStreak = habits.reduce((acc, h) => acc + h.streak, 0);

  // Habit Handlers
  const handleToggleHabitDate = (habitId: string, dateStr: string) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id !== habitId) return h;
        const alreadyDone = h.completedDates.includes(dateStr);
        const newDates = alreadyDone
          ? h.completedDates.filter(d => d !== dateStr)
          : [...h.completedDates, dateStr];

        // Recalculate simple streak
        const todayStr = getTodayDateStr();
        let newStreak = h.streak;
        if (dateStr === todayStr) {
          newStreak = alreadyDone ? Math.max(0, h.streak - 1) : h.streak + 1;
        }

        return {
          ...h,
          completedDates: newDates,
          streak: newStreak
        };
      })
    );
  };

  const handleToggleHabitToday = (habitId: string) => {
    handleToggleHabitDate(habitId, getTodayDateStr());
  };

  const handleAddHabit = (title: string, category: HabitCategory, color: string, targetPerWeek: number) => {
    const newHabit: Habit = {
      id: `h-${Date.now()}`,
      title,
      category,
      iconName: 'Sparkles',
      targetPerWeek,
      completedDates: [],
      streak: 0,
      color
    };
    setHabits(prev => [newHabit, ...prev]);
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
  };

  // Mood Handlers
  const handleAddMood = (mood: MoodType, intensity: number, note: string) => {
    const todayStr = getTodayDateStr();
    const existingIndex = moods.findIndex(m => m.date === todayStr);

    const newCheckIn: MoodCheckIn = {
      id: `m-${Date.now()}`,
      date: todayStr,
      mood,
      intensity,
      note,
      timestamp: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      const updated = [...moods];
      updated[existingIndex] = newCheckIn;
      setMoods(updated);
    } else {
      setMoods(prev => [newCheckIn, ...prev]);
    }
  };

  // Journal Handlers
  const handleAddJournal = (text: string, tags: string[]) => {
    const todayStr = getTodayDateStr();
    const analysis = analyzeReflection(text);

    const newEntry: JournalEntry = {
      id: `j-${Date.now()}`,
      text,
      date: todayStr,
      timestamp: new Date().toISOString(),
      analysis,
      tags
    };

    setJournal(prev => [newEntry, ...prev]);
  };

  const handleDeleteJournal = (id: string) => {
    setJournal(prev => prev.filter(j => j.id !== id));
  };

  // Community Handlers
  const handleAddCommunityPost = (content: string, emotionTag: EmotionType) => {
    const avatars = ['🌿', '✨', '☀️', '🌱', '🌊', '🔮'];
    const names = ['Kind Traveler', 'Mindful Seeker', 'Wellness Friend', 'Quiet Observer', 'Growth Nomad'];

    const newPost: CommunityPost = {
      id: `cp-${Date.now()}`,
      authorName: names[Math.floor(Math.random() * names.length)],
      authorAvatar: avatars[Math.floor(Math.random() * avatars.length)],
      content,
      timestamp: 'Just now',
      emotionTag,
      reactions: { spark: 1, peace: 1, support: 1, strength: 1 },
      userReactions: ['spark']
    };

    setCommunity(prev => [newPost, ...prev]);
  };

  const handleToggleReaction = (postId: string, reactionType: 'spark' | 'peace' | 'support' | 'strength') => {
    setCommunity(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        const hasReacted = p.userReactions.includes(reactionType);
        const newUserReactions = hasReacted
          ? p.userReactions.filter(r => r !== reactionType)
          : [...p.userReactions, reactionType];

        const newCount = hasReacted
          ? Math.max(0, p.reactions[reactionType] - 1)
          : p.reactions[reactionType] + 1;

        return {
          ...p,
          reactions: {
            ...p.reactions,
            [reactionType]: newCount
          },
          userReactions: newUserReactions
        };
      })
    );
  };

  const latestJournal = journal.length > 0 ? journal[0] : undefined;

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} totalStreak={totalStreak} />

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <DashboardTab
            moods={moods}
            onAddMood={handleAddMood}
            habits={habits}
            onToggleHabitToday={handleToggleHabitToday}
            latestJournal={latestJournal}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'habits' && (
          <HabitsTab
            habits={habits}
            onToggleHabitDate={handleToggleHabitDate}
            onAddHabit={handleAddHabit}
            onDeleteHabit={handleDeleteHabit}
          />
        )}

        {activeTab === 'journal' && (
          <JournalTab
            entries={journal}
            onAddJournal={handleAddJournal}
            onDeleteJournal={handleDeleteJournal}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsTab
            moods={moods}
            habits={habits}
            journal={journal}
          />
        )}

        {activeTab === 'community' && (
          <CommunityTab
            posts={community}
            onAddPost={handleAddCommunityPost}
            onToggleReaction={handleToggleReaction}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>🌿 MindCare – Community Wellness & Habit Tracking Platform with AI Sentiment Analysis</p>
      </footer>
    </div>
  );
};

export default App;
