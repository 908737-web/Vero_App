import { useState, useEffect } from 'react';

export interface CustomRealm {
  id: string;
  title: string;
  description: string;
  cardCount: number;
  createdAt: string;
}

export interface AnalyticsStats {
  currentStreak: number;
  totalCardsReviewed: number;
  retentionRate: number; // e.g., 85 for 85%
  heatmapData: { date: string; count: number }[];
}

export interface Milestone {
  id: string;
  title: string;
  unlocked: boolean;
  requirement: number; // e.g., total cards reviewed needed
}

export interface CommunityStat {
  realmId: string;
  title: string;
  downloads: number;
  upvotes: number;
}

const INITIAL_ANALYTICS: AnalyticsStats = {
  currentStreak: 12,
  totalCardsReviewed: 450,
  retentionRate: 88,
  heatmapData: [
    { date: '2026-05-10', count: 45 },
    { date: '2026-05-11', count: 60 },
    { date: '2026-05-12', count: 30 },
    { date: '2026-05-13', count: 50 },
    { date: '2026-05-14', count: 80 },
    { date: '2026-05-15', count: 120 },
  ],
};

const INITIAL_MILESTONES: Milestone[] = [
  { id: '1', title: "Novice Reviewer", unlocked: false, requirement: 100 },
  { id: '2', title: "Steady Learner", unlocked: false, requirement: 500 },
  { id: '3', title: "Ca' Foscari Scholar", unlocked: false, requirement: 1000 },
];

const INITIAL_COMMUNITY_STATS: CommunityStat[] = [
  { realmId: 'c1', title: 'Advanced Italian Idioms', downloads: 142, upvotes: 35 },
  { realmId: 'c2', title: 'Espresso Ordering Basics', downloads: 89, upvotes: 21 },
];

export function useUserProfile() {
  // 1. Favorites
  const [favorites, setFavorites] = useState<string[]>(['flashcard_2', 'flashcard_5']);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  // 2. My Realms (Custom Packages Logic)
  const [realms, setRealms] = useState<CustomRealm[]>([
    { id: 'r1', title: 'Travel Vocab', description: 'Words for my upcoming trip', cardCount: 15, createdAt: new Date().toISOString() }
  ]);

  const createRealm = (realm: Omit<CustomRealm, 'id' | 'createdAt'>) => {
    const newRealm: CustomRealm = {
      ...realm,
      id: `realm_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setRealms(prev => [...prev, newRealm]);
  };

  const updateRealm = (id: string, updates: Partial<CustomRealm>) => {
    setRealms(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteRealm = (id: string) => {
    setRealms(prev => prev.filter(r => r.id !== id));
  };

  // 3. Analytics & SM-2 Stats
  const [analytics, setAnalytics] = useState<AnalyticsStats>(INITIAL_ANALYTICS);

  // Function to simulate reviewing a card
  const simulateReview = () => {
    setAnalytics(prev => ({
      ...prev,
      totalCardsReviewed: prev.totalCardsReviewed + 1,
    }));
  };

  // 4. Milestones (Traguardi Logic)
  const [milestones, setMilestones] = useState<Milestone[]>(INITIAL_MILESTONES);

  // Evaluate milestones whenever analytics change
  useEffect(() => {
    setMilestones(prev => prev.map(milestone => {
      if (!milestone.unlocked && analytics.totalCardsReviewed >= milestone.requirement) {
        return { ...milestone, unlocked: true };
      }
      return milestone;
    }));
  }, [analytics.totalCardsReviewed]);

  // 5. Community Impact (Il Salotto Stats)
  const [communityStats, setCommunityStats] = useState<CommunityStat[]>(INITIAL_COMMUNITY_STATS);

  return {
    favorites,
    toggleFavorite,
    realms,
    createRealm,
    updateRealm,
    deleteRealm,
    analytics,
    simulateReview,
    milestones,
    communityStats
  };
}
