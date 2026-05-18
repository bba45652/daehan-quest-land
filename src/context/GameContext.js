import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const initialState = {
  player: {
    name: '대한',
    level: 1,
    totalXP: 0,
    streak: 0,
    lastLoginDate: null,
    title: '퀘스트 초보자',
  },
  quests: [
    { id: '1', title: '수학 숙제 완료하기', sub: '문제집 2페이지 풀기', type: 'study', difficulty: 'medium', xp: 25, completed: false, completedAt: null, isDaily: true },
    { id: '2', title: '양치질 2번 하기', sub: '아침·저녁 2분씩 꼼꼼하게', type: 'health', difficulty: 'easy', xp: 10, completed: false, completedAt: null, isDaily: true },
    { id: '3', title: '책 20분 읽기', sub: '좋아하는 책으로 20분!', type: 'reading', difficulty: 'medium', xp: 20, completed: false, completedAt: null, isDaily: true },
    { id: '4', title: '내일 준비물 챙기기', sub: '미리 가방 싸두기', type: 'prep', difficulty: 'easy', xp: 15, completed: false, completedAt: null, isDaily: true },
    { id: '5', title: '물 6잔 마시기', sub: '하루 동안 나눠 마시기', type: 'water', difficulty: 'easy', xp: 10, completed: false, completedAt: null, isDaily: true, progress: 0 },
    { id: '6', title: '30분 운동하기', sub: '달리기, 줄넘기 등 자유롭게', type: 'exercise', difficulty: 'hard', xp: 40, completed: false, completedAt: null, isDaily: false, special: true },
  ],
  rewards: [
    { id: 'r1', name: '영화 시간', emoji: '🍿', cost: 500, category: 'screen' },
    { id: 'r2', name: '게임 30분', emoji: '🎮', cost: 800, category: 'screen' },
    { id: 'r3', name: '아이스크림', emoji: '🍦', cost: 400, category: 'food' },
    { id: 'r4', name: '치킨 파티', emoji: '🍗', cost: 1200, category: 'food' },
    { id: 'r5', name: '친구와 놀기', emoji: '👫', cost: 900, category: 'activity' },
    { id: 'r6', name: '레고 세트', emoji: '🧱', cost: 3000, category: 'toy' },
  ],
  buddies: [
    { id: 'b1', name: '초록 친구', color: '#32D583', rarity: '레어', cost: 800, owned: true },
    { id: 'b2', name: '보라 마법사', color: '#9B8AFB', rarity: '에픽', cost: 1500, owned: false },
    { id: 'b3', name: '레드 드래곤', color: '#F97066', rarity: '전설', cost: 3000, owned: false, locked: true },
    { id: 'b4', name: '황금 햄스터', color: '#FAC515', rarity: '커먼', cost: 300, owned: true },
  ],
  badges: [
    { id: 'b1', title: '첫 퀘스트', emoji: '⭐', kind: 'star', earned: false, condition: '첫 퀘스트 완료' },
    { id: 'b2', title: '연속 3일', emoji: '🔥', kind: 'flame', earned: false, condition: '3일 연속 완료' },
    { id: 'b3', title: '연속 7일', emoji: '💎', kind: 'bolt', earned: false, condition: '7일 연속 완료' },
    { id: 'b4', title: '책벌레', emoji: '📖', kind: 'book', earned: false, condition: '독서 10회 완료' },
    { id: 'b5', title: '건강 챔피언', emoji: '💪', kind: 'tooth', earned: false, condition: '건강 10회 완료' },
    { id: 'b6', title: '레벨 5', emoji: '🏆', kind: 'crown', earned: false, condition: '레벨 5 달성' },
    { id: 'b7', title: '첫 보상', emoji: '🎁', kind: 'shield', earned: false, condition: '첫 보상 교환' },
    { id: 'b8', title: '공부왕', emoji: '🧠', kind: 'star', earned: false, condition: '공부 20회 완료' },
  ],
  questHistory: [],
  rewardHistory: [],
  parentPin: '1234',
};

const XP_PER_LEVEL = [0, 0, 500, 1000, 1800, 2800, 4000, 5500, 7200, 9200, 12000];
function xpForLevel(level) { return XP_PER_LEVEL[Math.min(level, XP_PER_LEVEL.length - 1)] || level * 1200; }
function calcLevel(totalXP) {
  let lv = 1;
  for (let i = 2; i <= 10; i++) { if (totalXP >= xpForLevel(i)) lv = i; else break; }
  return lv;
}
const TITLES = ['', '퀘스트 초보자', '용감한 탐험가', '퀘스트 전사', '영웅 견습생', '실력자', '퀘스트 마스터', '전설의 용사', '영웅', '슈퍼히어로', '전설'];

function gameReducer(state, action) {
  switch (action.type) {
    case 'LOAD_STATE':
      return { ...state, ...action.payload };

    case 'COMPLETE_QUEST': {
      const quest = state.quests.find((q) => q.id === action.questId);
      if (!quest || quest.completed) return state;
      const newTotal = state.player.totalXP + quest.xp;
      const newLevel = calcLevel(newTotal);
      const today = new Date().toDateString();
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
      const newStreak = state.player.lastLoginDate === today ? state.player.streak
        : state.player.lastLoginDate === yesterday.toDateString() ? state.player.streak + 1 : 1;
      const history = [...state.questHistory, quest];
      const updatedBadges = state.badges.map((b) => {
        if (b.earned) return b;
        if (b.id === 'b1' && history.length >= 1) return { ...b, earned: true };
        if (b.id === 'b2' && newStreak >= 3) return { ...b, earned: true };
        if (b.id === 'b3' && newStreak >= 7) return { ...b, earned: true };
        if (b.id === 'b6' && newLevel >= 5) return { ...b, earned: true };
        return b;
      });
      return {
        ...state,
        quests: state.quests.map((q) => q.id === action.questId ? { ...q, completed: true, completedAt: new Date().toISOString() } : q),
        questHistory: [{ ...quest, completedAt: new Date().toISOString() }, ...state.questHistory.slice(0, 49)],
        badges: updatedBadges,
        player: { ...state.player, totalXP: newTotal, level: newLevel, streak: newStreak, lastLoginDate: today, title: TITLES[newLevel] || TITLES[TITLES.length - 1] },
      };
    }

    case 'REDEEM_REWARD': {
      const reward = state.rewards.find((r) => r.id === action.rewardId);
      if (!reward || state.player.totalXP < reward.cost) return state;
      const newTotal = state.player.totalXP - reward.cost;
      const updatedBadges = state.badges.map((b) =>
        b.id === 'b7' && !b.earned && state.rewardHistory.length === 0 ? { ...b, earned: true } : b
      );
      return {
        ...state,
        rewardHistory: [{ ...reward, redeemedAt: new Date().toISOString() }, ...state.rewardHistory.slice(0, 19)],
        badges: updatedBadges,
        player: { ...state.player, totalXP: newTotal, level: calcLevel(newTotal) },
      };
    }

    case 'ADD_REWARD':
      return { ...state, rewards: [...state.rewards, { ...action.reward, id: `r_${Date.now()}` }] };
    case 'DELETE_REWARD':
      return { ...state, rewards: state.rewards.filter((r) => r.id !== action.rewardId) };
    case 'ADD_QUEST':
      return { ...state, quests: [...state.quests, { ...action.quest, id: `q_${Date.now()}`, completed: false }] };
    case 'RESET_DAILY':
      return { ...state, quests: state.quests.map((q) => q.isDaily ? { ...q, completed: false, completedAt: null } : q) };
    default:
      return state;
  }
}

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [session, setSession] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadPlayerData(session.user.id);
      setLoadingAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) loadPlayerData(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadPlayerData(userId) {
    const [{ data: player }, { data: history }, { data: rewards }, { data: earnedBadges }] = await Promise.all([
      supabase.from('players').select('*').eq('id', userId).single(),
      supabase.from('quest_history').select('*').eq('player_id', userId).order('completed_at', { ascending: false }).limit(50),
      supabase.from('rewards').select('*').eq('player_id', userId),
      supabase.from('badges').select('*').eq('player_id', userId),
    ]);

    const payload = {};

    if (player) {
      payload.player = {
        name: player.name,
        level: player.level,
        totalXP: player.total_xp,
        streak: player.streak,
        lastLoginDate: player.last_login_date,
        title: player.title,
      };
    }

    if (history?.length) {
      payload.questHistory = history.map((h) => ({
        id: h.quest_id, title: h.title, xp: h.xp, completedAt: h.completed_at,
      }));
    }

    if (rewards?.length) {
      payload.rewards = rewards.map((r) => ({
        id: r.id, name: r.name, emoji: r.emoji, cost: r.cost, category: r.category,
      }));
    }

    if (earnedBadges?.length) {
      const earnedIds = new Set(earnedBadges.map((b) => b.badge_id));
      payload.badges = initialState.badges.map((b) => ({ ...b, earned: earnedIds.has(b.id) }));
    }

    if (Object.keys(payload).length) dispatch({ type: 'LOAD_STATE', payload });
  }

  // 플레이어 상태 → Supabase 동기화
  useEffect(() => {
    if (!session) return;
    supabase.from('players').upsert({
      id: session.user.id,
      name: state.player.name,
      level: state.player.level,
      total_xp: state.player.totalXP,
      streak: state.player.streak,
      last_login_date: state.player.lastLoginDate,
      title: state.player.title,
    }).then(({ error }) => { if (error) console.error('Player sync error:', error); });
  }, [state.player]);

  // 퀘스트 완료 기록 저장
  useEffect(() => {
    if (!session || !state.questHistory.length) return;
    const latest = state.questHistory[0];
    if (!latest?.completedAt) return;
    supabase.from('quest_history').insert({
      player_id: session.user.id,
      quest_id: latest.id,
      title: latest.title,
      xp: latest.xp,
      completed_at: latest.completedAt,
    }).then(({ error }) => { if (error) console.error('Quest history sync error:', error); });
  }, [state.questHistory.length]);

  // 보상 목록 동기화
  useEffect(() => {
    if (!session) return;
    const sync = async () => {
      await supabase.from('rewards').delete().eq('player_id', session.user.id);
      if (state.rewards.length) {
        await supabase.from('rewards').insert(
          state.rewards.map((r) => ({ player_id: session.user.id, name: r.name, emoji: r.emoji, cost: r.cost, category: r.category }))
        );
      }
    };
    sync().catch(console.error);
  }, [state.rewards]);

  // 뱃지 획득 동기화
  useEffect(() => {
    if (!session) return;
    const earned = state.badges.filter((b) => b.earned);
    if (!earned.length) return;
    Promise.all(
      earned.map((b) => supabase.from('badges').upsert({ player_id: session.user.id, badge_id: b.id }))
    ).catch(console.error);
  }, [state.badges]);

  const completedCount = state.quests.filter((q) => q.completed).length;
  const totalCount = state.quests.length;
  const dailyProgress = totalCount > 0 ? completedCount / totalCount : 0;
  const xpCurrent = state.player.totalXP - xpForLevel(state.player.level);
  const xpNeeded = xpForLevel(state.player.level + 1) - xpForLevel(state.player.level);
  const xpProgress = Math.max(0, Math.min(1, xpCurrent / (xpNeeded || 1)));

  return (
    <GameContext.Provider value={{
      state, dispatch, session, loadingAuth,
      completedCount, totalCount, dailyProgress, xpCurrent, xpNeeded, xpProgress,
      completeQuest: (id) => dispatch({ type: 'COMPLETE_QUEST', questId: id }),
      redeemReward: (id) => dispatch({ type: 'REDEEM_REWARD', rewardId: id }),
      addReward: (r) => dispatch({ type: 'ADD_REWARD', reward: r }),
      deleteReward: (id) => dispatch({ type: 'DELETE_REWARD', rewardId: id }),
      addQuest: (q) => dispatch({ type: 'ADD_QUEST', quest: q }),
      signOut: () => supabase.auth.signOut(),
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
