import React from 'react';
import { LayoutDashboard, CheckSquare, BookOpenCheck, BarChart3, Users, HeartHandshake, Flame, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  totalStreak: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, totalStreak }) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'habits', label: 'Habit Tracker', icon: CheckSquare },
    { id: 'journal', label: 'AI Reflection', icon: BookOpenCheck },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'community', label: 'Community Feed', icon: Users },
  ];

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        <div className="brand-logo" onClick={() => setActiveTab('dashboard')}>
          <div className="brand-icon-wrapper">
            <HeartHandshake className="brand-icon" size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-title">MindCare</span>
            <span className="brand-subtitle">Wellness & Habits</span>
          </div>
        </div>

        <nav className="nav-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-btn ${isActive ? 'active' : ''}`}
                id={`nav-${item.id}`}
              >
                <Icon size={18} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
                {item.id === 'journal' && (
                  <span className="badge-ai-pill">
                    <Sparkles size={11} /> AI
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="header-actions">
          <div className="streak-badge" title="Total Habit Streak Days">
            <Flame size={18} className="flame-icon" />
            <span className="streak-count">{totalStreak} Days</span>
          </div>
        </div>
      </div>
    </header>
  );
};
