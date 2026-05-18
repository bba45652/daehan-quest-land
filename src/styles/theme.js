// Design system from Claude Design — 대한 퀘스트 랜드
// Light sky-blue canvas, chunky 3D arcade style, Roblox-inspired

export const COLORS = {
  // Backgrounds
  bgCanvas: '#EAF4FF',
  bgSoft: '#F5FAFF',
  bgSubtle: '#F2F4F7',

  // Ink / Text
  ink: '#0B2545',
  inkSoft: '#1B3A6B',

  // Blue (primary)
  blue: '#2E90FA',
  blueDeep: '#1570EF',
  blueDark: '#0B5DB8',
  blueTint: '#D1E9FF',

  // Green (quests / XP bar)
  green: '#32D583',
  greenDeep: '#12B76A',
  greenDark: '#027A48',
  greenTint: '#D1FADF',

  // Yellow (XP / coins / gold)
  yellow: '#FDE272',
  yellowMid: '#FAC515',
  yellowDeep: '#EAAA08',
  yellowDark: '#A15C07',

  // Red
  red: '#F97066',
  redDeep: '#F04438',
  redDark: '#B42318',

  // Purple
  purple: '#9B8AFB',
  purpleDark: '#53389E',

  // Pink
  pink: '#FDA29B',

  // White
  white: '#FFFFFF',
};

export const INK = '#0B2545';

export const FONT_GAME = 'Sora, "Noto Sans KR", System';

export const QUEST_TYPES = {
  study:    { icon: 'book',  tint: '#D1E9FF', col: '#2E90FA', label: '공부' },
  health:   { icon: 'tooth', tint: '#D1FADF', col: '#12B76A', label: '건강' },
  reading:  { icon: 'book',  tint: '#EDE9FE', col: '#6941C6', label: '독서' },
  prep:     { icon: 'gift',  tint: '#FEF3C7', col: '#D97706', label: '준비' },
  exercise: { icon: 'run',   tint: '#FEE4E2', col: '#F04438', label: '운동' },
  chores:   { icon: 'broom', tint: '#FEF7C3', col: '#CA8A04', label: '집안일' },
  water:    { icon: 'water', tint: '#DBEAFE', col: '#2563EB', label: '수분' },
};

export const DIFFICULTY = {
  easy:   { label: '쉬움', chipClass: 'solid-green',  xp: 10 },
  medium: { label: '보통', chipClass: 'solid-blue',   xp: 25 },
  hard:   { label: '어려움', chipClass: 'solid-red',  xp: 40 },
};
