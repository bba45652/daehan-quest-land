// "토리" mascot — blocky robo-tiger with Korean gat hat (from Claude Design)
import React from 'react';
import Svg, {
  Rect, Circle, Ellipse, Path, Line, LinearGradient, Stop, Defs,
} from 'react-native-svg';

const INK = '#0B2545';

export function HeroChar({ size = 120, mood = 'happy', accent = '#2E90FA' }) {
  const eyeOpen = mood !== 'sleep';
  const mouthPath = {
    happy: 'M 70 122 Q 90 138 110 122',
    cheer: 'M 68 118 Q 90 142 112 118 Q 90 128 68 118 Z',
    sleep: 'M 75 128 Q 90 134 105 128',
    wow:   'M 82 128 a 8 9 0 1 0 16 0 a 8 9 0 1 0 -16 0',
  }[mood] || 'M 70 122 Q 90 138 110 122';

  return (
    <Svg width={size} height={size} viewBox="0 0 180 180">
      <Defs>
        <LinearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFE489" />
          <Stop offset="1" stopColor="#FAC515" />
        </LinearGradient>
        <LinearGradient id="bellyGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFAEA" />
          <Stop offset="1" stopColor="#FDE272" />
        </LinearGradient>
      </Defs>
      {/* shadow */}
      <Ellipse cx="90" cy="168" rx="42" ry="6" fill={INK} opacity="0.18" />
      {/* ears */}
      <Path d="M 36 60 L 30 30 L 58 50 Z" fill="url(#bodyGrad)" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <Path d="M 144 60 L 150 30 L 122 50 Z" fill="url(#bodyGrad)" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <Path d="M 38 55 L 36 38 L 50 47 Z" fill="#F97066" />
      <Path d="M 142 55 L 144 38 L 130 47 Z" fill="#F97066" />
      {/* body */}
      <Rect x="26" y="44" width="128" height="120" rx="44" fill="url(#bodyGrad)" stroke={INK} strokeWidth="4" />
      {/* belly */}
      <Ellipse cx="90" cy="120" rx="42" ry="36" fill="url(#bellyGrad)" stroke={INK} strokeWidth="3" />
      {/* stripes */}
      <Path d="M 50 60 q 10 4 6 16" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <Path d="M 130 60 q -10 4 -6 16" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <Path d="M 44 92 q 10 2 12 8" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <Path d="M 136 92 q -10 2 -12 8" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      {/* cheeks */}
      <Circle cx="56" cy="106" r="7" fill="#FDA29B" opacity="0.85" />
      <Circle cx="124" cy="106" r="7" fill="#FDA29B" opacity="0.85" />
      {/* eyes */}
      {eyeOpen ? (
        <>
          <Circle cx="70" cy="92" r="9" fill={INK} />
          <Circle cx="110" cy="92" r="9" fill={INK} />
          <Circle cx="73" cy="89" r="3" fill="white" />
          <Circle cx="113" cy="89" r="3" fill="white" />
        </>
      ) : (
        <>
          <Path d="M 61 92 q 9 -6 18 0" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <Path d="M 101 92 q 9 -6 18 0" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      )}
      {/* mouth */}
      <Path d={mouthPath} stroke={INK} strokeWidth="3.5"
        fill={mood === 'cheer' || mood === 'wow' ? '#F04438' : 'none'}
        strokeLinejoin="round" strokeLinecap="round" />
      {/* nose */}
      <Circle cx="90" cy="108" r="3.5" fill={INK} />
      {/* gat (Korean traditional hat) */}
      <Ellipse cx="90" cy="34" rx="46" ry="6" fill={INK} />
      <Rect x="74" y="14" width="32" height="22" rx="3" fill={INK} />
      <Rect x="78" y="20" width="24" height="12" fill={accent} opacity="0.6" />
    </Svg>
  );
}

export function MiniBuddy({ size = 56, color = '#32D583' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Ellipse cx="50" cy="92" rx="24" ry="4" fill={INK} opacity="0.18" />
      <Rect x="18" y="22" width="64" height="64" rx="22" fill={color} stroke={INK} strokeWidth="3.5" />
      <Ellipse cx="50" cy="64" rx="22" ry="16" fill="white" opacity="0.6" />
      <Circle cx="38" cy="50" r="5" fill={INK} />
      <Circle cx="62" cy="50" r="5" fill={INK} />
      <Circle cx="40" cy="48" r="1.5" fill="white" />
      <Circle cx="64" cy="48" r="1.5" fill="white" />
      <Path d="M 40 68 q 10 8 20 0" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      <Line x1="50" y1="22" x2="50" y2="12" stroke={INK} strokeWidth="3" />
      <Circle cx="50" cy="10" r="3.5" fill="#FAC515" stroke={INK} strokeWidth="2.5" />
    </Svg>
  );
}
