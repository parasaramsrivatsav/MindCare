import type { Habit, JournalEntry, MoodCheckIn, CommunityPost } from '../types';
import { analyzeReflection } from './nlpAnalyzer';

const STORAGE_KEYS = {
  HABITS: 'mindcare_habits',
  MOODS: 'mindcare_moods',
  JOURNAL: 'mindcare_journal',
  COMMUNITY: 'mindcare_community'
};

// Helpers for formatted dates
export function getTodayDateStr(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export function getPastDateStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

const INITIAL_HABITS: Habit[] = [
  {
    id: 'h1',
    title: '10-Min Morning Meditation',
    category: 'Mindfulness',
    iconName: 'Sparkles',
    targetPerWeek: 7,
    completedDates: [getPastDateStr(0), getPastDateStr(1), getPastDateStr(2), getPastDateStr(4), getPastDateStr(5)],
    streak: 3,
    color: '#10B981' // Emerald
  },
  {
    id: 'h2',
    title: 'Hydrate (2.5L Water)',
    category: 'Nutrition',
    iconName: 'Droplet',
    targetPerWeek: 7,
    completedDates: [getPastDateStr(0), getPastDateStr(1), getPastDateStr(2), getPastDateStr(3), getPastDateStr(4), getPastDateStr(6)],
    streak: 5,
    color: '#06B6D4' // Cyan
  },
  {
    id: 'h3',
    title: 'Evening Sunshine Walk',
    category: 'Fitness',
    iconName: 'Footprints',
    targetPerWeek: 5,
    completedDates: [getPastDateStr(1), getPastDateStr(2), getPastDateStr(3), getPastDateStr(5)],
    streak: 0,
    color: '#F59E0B' // Amber
  },
  {
    id: 'h4',
    title: 'Read 15 Pages of Book',
    category: 'Learning',
    iconName: 'BookOpen',
    targetPerWeek: 5,
    completedDates: [getPastDateStr(0), getPastDateStr(1), getPastDateStr(3), getPastDateStr(4)],
    streak: 2,
    color: '#8B5CF6' // Purple
  },
  {
    id: 'h5',
    title: 'Digital Unplug Before Bed',
    category: 'Self-Care',
    iconName: 'Moon',
    targetPerWeek: 6,
    completedDates: [getPastDateStr(0), getPastDateStr(2), getPastDateStr(4)],
    streak: 1,
    color: '#EC4899' // Pink
  }
];

const INITIAL_MOODS: MoodCheckIn[] = [
  {
    id: 'm-0',
    date: getPastDateStr(0),
    mood: 'great',
    intensity: 9,
    note: 'Felt very energized after early morning walk and meditation.',
    timestamp: new Date().toISOString()
  },
  {
    id: 'm-1',
    date: getPastDateStr(1),
    mood: 'good',
    intensity: 8,
    note: 'Productive day at work and good team meeting.',
    timestamp: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'm-2',
    date: getPastDateStr(2),
    mood: 'stressed',
    intensity: 4,
    note: 'Felt a bit overwhelmed with project deadlines.',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'm-3',
    date: getPastDateStr(3),
    mood: 'good',
    intensity: 7,
    note: 'Relaxing afternoon, read two chapters of my book.',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'm-4',
    date: getPastDateStr(4),
    mood: 'great',
    intensity: 9,
    note: 'Completed all my wellness habits today!',
    timestamp: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'm-5',
    date: getPastDateStr(5),
    mood: 'neutral',
    intensity: 6,
    note: 'Ordinary day, steady focus.',
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'm-6',
    date: getPastDateStr(6),
    mood: 'down',
    intensity: 5,
    note: 'Did not sleep well last night.',
    timestamp: new Date(Date.now() - 86400000 * 6).toISOString()
  }
];

const INITIAL_JOURNAL: JournalEntry[] = [
  {
    id: 'j-0',
    text: 'Started today with 10 minutes of deep meditation and a refreshing morning walk. I feel extremely grateful and peaceful right now. Built good momentum for the upcoming project!',
    date: getPastDateStr(0),
    timestamp: new Date().toISOString(),
    analysis: analyzeReflection('Started today with 10 minutes of deep meditation and a refreshing morning walk. I feel extremely grateful and peaceful right now. Built good momentum for the upcoming project!'),
    tags: ['Mindfulness', 'Morning Routine', 'Gratitude']
  },
  {
    id: 'j-1',
    text: 'Felt a little anxious around mid-day due to a tight deadline, but I took three deep breath cycles and stepped away for tea. Feeling much calmer and accomplished now.',
    date: getPastDateStr(1),
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    analysis: analyzeReflection('Felt a little anxious around mid-day due to a tight deadline, but I took three deep breath cycles and stepped away for tea. Feeling much calmer and accomplished now.'),
    tags: ['Work', 'Stress Relief']
  },
  {
    id: 'j-2',
    text: 'Heavy workload today left me feeling drained and slightly burnt out. Realized I need to protect my evening wind-down routine and avoid checking emails late.',
    date: getPastDateStr(2),
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    analysis: analyzeReflection('Heavy workload today left me feeling drained and slightly burnt out. Realized I need to protect my evening wind-down routine and avoid checking emails late.'),
    tags: ['Reflection', 'Self-Care']
  }
];

const INITIAL_COMMUNITY: CommunityPost[] = [
  {
    id: 'cp-1',
    authorName: 'Aria Chen',
    authorAvatar: '🌿',
    content: 'Just hit my 14-day streak on daily mindfulness! To anyone feeling overwhelmed today: remember that small 5-minute pauses make a world of difference.',
    timestamp: '2 hours ago',
    emotionTag: 'Joy & Gratitude',
    reactions: { spark: 18, peace: 24, support: 12, strength: 15 },
    userReactions: ['peace', 'spark']
  },
  {
    id: 'cp-2',
    authorName: 'Marcus Vance',
    authorAvatar: '🌊',
    content: 'Replacing late-night screen scrolling with 15 minutes of physical reading has improved my sleep quality tremendously. Grateful for this community!',
    timestamp: '5 hours ago',
    emotionTag: 'Serenity & Calm',
    reactions: { spark: 14, peace: 31, support: 9, strength: 20 },
    userReactions: ['strength']
  },
  {
    id: 'cp-3',
    authorName: 'Elena Rostova',
    authorAvatar: '✨',
    content: 'Struggled with motivation this morning, but forced myself to take a 10-minute sunshine walk. The sentiment analyzer reminded me how much movement improves mood!',
    timestamp: '1 day ago',
    emotionTag: 'Motivation & Drive',
    reactions: { spark: 22, peace: 15, support: 19, strength: 27 },
    userReactions: []
  }
];

export function loadHabits(): Habit[] {
  const data = localStorage.getItem(STORAGE_KEYS.HABITS);
  return data ? JSON.parse(data) : INITIAL_HABITS;
}

export function saveHabits(habits: Habit[]) {
  localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
}

export function loadMoods(): MoodCheckIn[] {
  const data = localStorage.getItem(STORAGE_KEYS.MOODS);
  return data ? JSON.parse(data) : INITIAL_MOODS;
}

export function saveMoods(moods: MoodCheckIn[]) {
  localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(moods));
}

export function loadJournal(): JournalEntry[] {
  const data = localStorage.getItem(STORAGE_KEYS.JOURNAL);
  return data ? JSON.parse(data) : INITIAL_JOURNAL;
}

export function saveJournal(entries: JournalEntry[]) {
  localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(entries));
}

export function loadCommunity(): CommunityPost[] {
  const data = localStorage.getItem(STORAGE_KEYS.COMMUNITY);
  return data ? JSON.parse(data) : INITIAL_COMMUNITY;
}

export function saveCommunity(posts: CommunityPost[]) {
  localStorage.setItem(STORAGE_KEYS.COMMUNITY, JSON.stringify(posts));
}
