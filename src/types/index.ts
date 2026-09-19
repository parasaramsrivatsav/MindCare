export type MoodType = 'great' | 'good' | 'neutral' | 'down' | 'stressed';

export interface MoodCheckIn {
  id: string;
  date: string; // YYYY-MM-DD
  mood: MoodType;
  intensity: number; // 1 to 10
  note?: string;
  timestamp: string;
}

export type HabitCategory = 'Mindfulness' | 'Fitness' | 'Learning' | 'Self-Care' | 'Nutrition';

export interface Habit {
  id: string;
  title: string;
  category: HabitCategory;
  iconName: string;
  targetPerWeek: number;
  completedDates: string[]; // ['YYYY-MM-DD']
  streak: number;
  color: string;
}

export type EmotionType = 
  | 'Joy & Gratitude' 
  | 'Serenity & Calm' 
  | 'Motivation & Drive' 
  | 'Reflective & Thoughtful' 
  | 'Stress & Overwhelm' 
  | 'Anxiety & Restless' 
  | 'Tired & Low Energy';

export interface SentimentAnalysisResult {
  score: number; // -10 to +10
  label: 'Very Positive' | 'Positive' | 'Balanced & Reflective' | 'Mildly Stressed' | 'Challenging';
  dominantEmotion: EmotionType;
  keywords: string[];
  insights: string[];
}

export interface JournalEntry {
  id: string;
  text: string;
  date: string;
  timestamp: string;
  analysis: SentimentAnalysisResult;
  tags: string[];
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  emotionTag: EmotionType;
  reactions: {
    spark: number;
    peace: number;
    support: number;
    strength: number;
  };
  userReactions: string[]; // e.g. ['spark']
}
