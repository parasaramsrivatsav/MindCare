import type { SentimentAnalysisResult, EmotionType } from '../types';

// Expanded sentiment lexicon for natural language processing
const POSITIVE_LEXICON: Record<string, number> = {
  happy: 3, joyful: 4, grateful: 4, accomplished: 3, peaceful: 3, relaxed: 3,
  energetic: 3, productive: 3, excited: 4, calm: 3, focused: 2, serene: 4,
  inspired: 4, confident: 3, loved: 4, optimistic: 3, content: 3, refreshed: 3,
  good: 2, great: 3, awesome: 4, wonderful: 4, progress: 2, proud: 3,
  meditated: 2, walked: 2, slept: 2, exercise: 2, healthy: 2, hope: 2,
  smile: 2, laughter: 3, clarity: 3, relief: 3, thrive: 4, balance: 3
};

const NEGATIVE_LEXICON: Record<string, number> = {
  sad: -3, anxious: -4, stressed: -4, overwhelmed: -4, tired: -2, exhausted: -3,
  angry: -4, frustrated: -3, lonely: -3, hopeless: -5, worried: -3, nervous: -3,
  burnt: -4, burn: -3, pain: -3, struggle: -3, difficult: -2, fail: -3,
  drained: -4, pressure: -3, chaotic: -3, fear: -4, heavy: -3, bad: -2,
  terrible: -4, awful: -4, stuck: -3, doubt: -3, sleepiness: -2, insomniac: -3
};

const EMOTION_PATTERNS: { emotion: EmotionType; keywords: string[] }[] = [
  {
    emotion: 'Joy & Gratitude',
    keywords: ['grateful', 'happy', 'thankful', 'blessed', 'joy', 'smile', 'loved', 'awesome', 'wonderful', 'content', 'proud']
  },
  {
    emotion: 'Serenity & Calm',
    keywords: ['calm', 'peaceful', 'meditated', 'relaxed', 'quiet', 'nature', 'breathe', 'clarity', 'rested', 'harmony', 'still']
  },
  {
    emotion: 'Motivation & Drive',
    keywords: ['productive', 'focused', 'accomplished', 'goal', 'energetic', 'progress', 'inspired', 'confident', 'built', 'created']
  },
  {
    emotion: 'Reflective & Thoughtful',
    keywords: ['thinking', 'realized', 'journal', 'learn', 'future', 'mind', 'wonder', 'perspective', 'growth', 'path']
  },
  {
    emotion: 'Stress & Overwhelm',
    keywords: ['stressed', 'overwhelmed', 'deadline', 'pressure', 'work', 'busy', 'chaotic', 'rushed', 'exhausted', 'burnt']
  },
  {
    emotion: 'Anxiety & Restless',
    keywords: ['anxious', 'worried', 'nervous', 'fear', 'uncertain', 'panic', 'restless', 'doubt', 'overthinking']
  },
  {
    emotion: 'Tired & Low Energy',
    keywords: ['tired', 'drained', 'sleepy', 'heavy', 'sluggish', 'exhausted', 'unmotivated', 'low energy', 'fatigue']
  }
];

export function analyzeReflection(text: string): SentimentAnalysisResult {
  if (!text || text.trim().length === 0) {
    return {
      score: 0,
      label: 'Balanced & Reflective',
      dominantEmotion: 'Reflective & Thoughtful',
      keywords: [],
      insights: ['Write a few lines about your day to receive personalized sentiment insights.']
    };
  }

  const cleanText = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const words = cleanText.split(/\s+/).filter(w => w.length > 2);

  let score = 0;
  const matchedKeywords: Set<string> = new Set();
  const emotionScores: Record<EmotionType, number> = {
    'Joy & Gratitude': 0,
    'Serenity & Calm': 0,
    'Motivation & Drive': 0,
    'Reflective & Thoughtful': 0,
    'Stress & Overwhelm': 0,
    'Anxiety & Restless': 0,
    'Tired & Low Energy': 0
  };

  words.forEach(word => {
    if (POSITIVE_LEXICON[word]) {
      score += POSITIVE_LEXICON[word];
      matchedKeywords.add(word);
    }
    if (NEGATIVE_LEXICON[word]) {
      score += NEGATIVE_LEXICON[word];
      matchedKeywords.add(word);
    }

    EMOTION_PATTERNS.forEach(pat => {
      if (pat.keywords.includes(word)) {
        emotionScores[pat.emotion] += 1;
      }
    });
  });

  // Clamp score between -10 and 10
  score = Math.max(-10, Math.min(10, score));

  // Determine dominant emotion
  let dominantEmotion: EmotionType = 'Reflective & Thoughtful';
  let maxEmotionScore = -1;

  (Object.keys(emotionScores) as EmotionType[]).forEach(emo => {
    if (emotionScores[emo] > maxEmotionScore) {
      maxEmotionScore = emotionScores[emo];
      dominantEmotion = emo;
    }
  });

  // Default fallbacks if no strong emotion keywords found
  if (maxEmotionScore <= 0) {
    if (score >= 4) dominantEmotion = 'Joy & Gratitude';
    else if (score >= 1) dominantEmotion = 'Serenity & Calm';
    else if (score <= -4) dominantEmotion = 'Stress & Overwhelm';
    else if (score < 0) dominantEmotion = 'Anxiety & Restless';
    else dominantEmotion = 'Reflective & Thoughtful';
  }

  // Label assignment
  let label: SentimentAnalysisResult['label'] = 'Balanced & Reflective';
  if (score >= 5) label = 'Very Positive';
  else if (score >= 2) label = 'Positive';
  else if (score <= -5) label = 'Challenging';
  else if (score <= -2) label = 'Mildly Stressed';

  // Generate AI Suggestions & Self-Improvement Tips based on sentiment & emotion
  const insights: string[] = [];

  const emoStr = dominantEmotion as string;

  if (emoStr === 'Stress & Overwhelm' || emoStr === 'Anxiety & Restless') {
    insights.push('🌿 MindCare AI Tip: High cognitive tension detected. Try a 5-minute boxed breathing session (4s in, 4s hold, 4s out) to reset your nervous system.');
    insights.push('💡 Habit Insight: Breaking large tasks into 15-minute micro-habits significantly reduces overwhelm.');
  } else if (emoStr === 'Tired & Low Energy') {
    insights.push('☀️ MindCare AI Tip: Low energy signals a need for recovery. Prioritize hydration, a 15-minute sunshine walk, or early sleep tonight.');
    insights.push('💡 Habit Insight: Pair light movement with your morning routine to gently elevate vitality.');
  } else if (emoStr === 'Joy & Gratitude' || emoStr === 'Serenity & Calm') {
    insights.push('✨ MindCare AI Insight: Great emotional equilibrium detected! Capitalize on this positive momentum for focus and creative reflection.');
    insights.push('🎯 Habit Insight: You are maintaining strong habit consistency. Log this peak state to anchor positive patterns.');
  } else if (emoStr === 'Motivation & Drive') {
    insights.push('🚀 MindCare AI Insight: Strong sense of self-efficacy and determination! Maintain focus without sacrificing rest.');
  } else {
    insights.push('🧘 MindCare AI Insight: Balanced reflection entry recorded. Regular daily journal check-ins build long-term emotional resilience.');
  }

  if (matchedKeywords.size > 0) {
    insights.push(`🔍 Key Emotional Indicators: ${Array.from(matchedKeywords).slice(0, 4).join(', ')}`);
  }

  return {
    score,
    label,
    dominantEmotion,
    keywords: Array.from(matchedKeywords),
    insights
  };
}
