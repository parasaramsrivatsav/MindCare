import React, { useState } from 'react';
import type { CommunityPost, EmotionType } from '../types';
import { Shield, Flame, Plus } from 'lucide-react';

interface CommunityTabProps {
  posts: CommunityPost[];
  onAddPost: (content: string, emotionTag: EmotionType) => void;
  onToggleReaction: (postId: string, reactionType: 'spark' | 'peace' | 'support' | 'strength') => void;
}

const EMOTION_TAGS: EmotionType[] = [
  'Joy & Gratitude',
  'Serenity & Calm',
  'Motivation & Drive',
  'Reflective & Thoughtful',
  'Stress & Overwhelm',
  'Tired & Low Energy'
];

export const CommunityTab: React.FC<CommunityTabProps> = ({
  posts,
  onAddPost,
  onToggleReaction
}) => {
  const [showPostModal, setShowPostModal] = useState(false);
  const [content, setContent] = useState('');
  const [emotionTag, setEmotionTag] = useState<EmotionType>('Serenity & Calm');

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onAddPost(content.trim(), emotionTag);
    setContent('');
    setShowPostModal(false);
  };

  return (
    <div className="tab-content community-tab">
      <div className="page-header">
        <div>
          <h1 className="page-title">Community Wellness Feed</h1>
          <p className="page-subtitle">A safe, wholesome space to share anonymous reflections, offer encouragement, and join community wellness challenges.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowPostModal(true)}>
          <Plus size={18} /> Share Reflection
        </button>
      </div>

      <div className="community-grid">
        {/* Main Feed Column */}
        <div className="community-feed-column">
          {posts.map(post => (
            <div key={post.id} className="card community-post-card">
              <div className="post-header">
                <div className="author-info">
                  <div className="author-avatar">{post.authorAvatar}</div>
                  <div>
                    <h3 className="author-name">{post.authorName}</h3>
                    <span className="post-time">{post.timestamp}</span>
                  </div>
                </div>
                <span className="emotion-pill-badge">{post.emotionTag}</span>
              </div>

              <p className="post-content">"{post.content}"</p>

              <div className="post-reactions-row">
                <button
                  className={`reaction-btn ${post.userReactions.includes('spark') ? 'active' : ''}`}
                  onClick={() => onToggleReaction(post.id, 'spark')}
                >
                  ✨ <span>{post.reactions.spark} Spark</span>
                </button>

                <button
                  className={`reaction-btn ${post.userReactions.includes('peace') ? 'active' : ''}`}
                  onClick={() => onToggleReaction(post.id, 'peace')}
                >
                  🌿 <span>{post.reactions.peace} Peace</span>
                </button>

                <button
                  className={`reaction-btn ${post.userReactions.includes('support') ? 'active' : ''}`}
                  onClick={() => onToggleReaction(post.id, 'support')}
                >
                  ❤️ <span>{post.reactions.support} Support</span>
                </button>

                <button
                  className={`reaction-btn ${post.userReactions.includes('strength') ? 'active' : ''}`}
                  onClick={() => onToggleReaction(post.id, 'strength')}
                >
                  💪 <span>{post.reactions.strength} Strength</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Column */}
        <div className="community-sidebar-column">
          {/* Community Challenge Card */}
          <div className="card challenge-card">
            <div className="challenge-icon-badge">
              <Flame size={24} className="text-amber" />
            </div>
            <h2>Weekly Community Challenge</h2>
            <h3>7-Day Mindful Breathing & Unplug</h3>
            <p>Take 5 minutes at 8:00 PM every night to disengage from screens and practice calm box-breathing.</p>

            <div className="challenge-meta">
              <span>👥 248 Members Participating</span>
              <div className="progress-bar-small">
                <div className="fill" style={{ width: '68%' }} />
              </div>
            </div>

            <button className="btn btn-secondary btn-full btn-sm">
              Joined Challenge ✓
            </button>
          </div>

          {/* Safety & Kindness Card */}
          <div className="card safety-card">
            <Shield size={20} className="text-emerald" />
            <h3>MindCare Community Values</h3>
            <ul>
              <li>• Always offer empathetic, uplifting responses</li>
              <li>• Respect anonymity and personal journeys</li>
              <li>• Celebrate small daily mental health progress</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Share Post Modal */}
      {showPostModal && (
        <div className="modal-backdrop" onClick={() => setShowPostModal(false)}>
          <div className="modal-content card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Share Anonymous Community Reflection</h2>
              <button className="close-btn" onClick={() => setShowPostModal(false)}>×</button>
            </div>

            <form onSubmit={handlePostSubmit} className="modal-form">
              <div className="input-group">
                <label className="input-label">Your Encouraging Reflection</label>
                <textarea
                  placeholder="Share a win, learning moment, or encouraging note with the community..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="journal-textarea"
                  rows={4}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Emotion Tag</label>
                <select
                  value={emotionTag}
                  onChange={e => setEmotionTag(e.target.value as EmotionType)}
                  className="select-input"
                >
                  {EMOTION_TAGS.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPostModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Post to Feed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
