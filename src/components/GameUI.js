// Shared game UI primitives matching the Claude Design system
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, INK } from '../styles/theme';

// ── Chunky 3D button ─────────────────────────────────────────────────────────
export function Btn3D({ label, onPress, variant = 'blue', size = 'md', icon, style }) {
  const bg = {
    blue:   COLORS.blue,
    green:  COLORS.green,
    yellow: COLORS.yellowMid,
    red:    COLORS.redDeep,
    purple: COLORS.purple,
    ghost:  COLORS.white,
  }[variant] || COLORS.blue;

  const shadow = {
    blue:   COLORS.blueDark,
    green:  COLORS.greenDark,
    yellow: COLORS.yellowDark,
    red:    COLORS.redDark,
    purple: COLORS.purpleDark,
    ghost:  '#C3D1E5',
  }[variant] || COLORS.blueDark;

  const textColor = variant === 'yellow' || variant === 'ghost' ? INK : COLORS.white;

  const padding = size === 'lg' ? { paddingVertical: 16, paddingHorizontal: 28 }
    : size === 'sm' ? { paddingVertical: 8, paddingHorizontal: 14 }
    : { paddingVertical: 12, paddingHorizontal: 20 };

  const fontSize = size === 'lg' ? 20 : size === 'sm' ? 13 : 16;
  const radius   = size === 'lg' ? 22 : 18;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[{
        backgroundColor: bg,
        borderRadius: radius,
        borderWidth: 3,
        borderColor: INK,
        ...padding,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        // 3D shadow — bottom-right offset solid border trick
        shadowColor: INK,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 5,
        // Inner layer for the colored part of shadow
        borderBottomWidth: 7,
        borderBottomColor: shadow,
      }, style]}
    >
      {icon && <Text style={{ fontSize: fontSize - 2 }}>{icon}</Text>}
      <Text style={{
        fontWeight: '800',
        fontSize,
        color: textColor,
        letterSpacing: -0.3,
      }}>{label}</Text>
    </TouchableOpacity>
  );
}

// ── Chunky card ───────────────────────────────────────────────────────────────
export function GCard({ children, style, bg }) {
  return (
    <View style={[{
      backgroundColor: bg || COLORS.white,
      borderRadius: 22,
      borderWidth: 3,
      borderColor: INK,
      shadowColor: INK,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.18,
      shadowRadius: 0,
      elevation: 4,
      overflow: 'visible',
    }, style]}>
      {children}
    </View>
  );
}

// ── XP progress bar ───────────────────────────────────────────────────────────
export function XPBar({ progress = 0, variant = 'green', height = 18 }) {
  const fillColor = {
    green:  COLORS.green,
    yellow: COLORS.yellowMid,
    blue:   COLORS.blue,
  }[variant] || COLORS.green;

  return (
    <View style={{
      height,
      backgroundColor: '#B8CCE5',
      borderRadius: 999,
      borderWidth: 3,
      borderColor: INK,
      overflow: 'hidden',
    }}>
      <View style={{
        position: 'absolute',
        left: 0, top: 0, bottom: 0,
        width: `${Math.max(4, Math.min(100, progress * 100))}%`,
        backgroundColor: fillColor,
        borderRadius: 999,
      }} />
      {/* shine */}
      <View style={{
        position: 'absolute',
        left: 4, right: 12, top: 2,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderRadius: 999,
      }} />
    </View>
  );
}

// ── Level badge ───────────────────────────────────────────────────────────────
export function LevelBadge({ level }) {
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', gap: 8,
      backgroundColor: COLORS.yellowMid,
      borderRadius: 14,
      borderWidth: 3,
      borderColor: INK,
      paddingVertical: 6,
      paddingHorizontal: 12,
      shadowColor: COLORS.yellowDark,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 3,
    }}>
      <Text style={{ fontWeight: '800', fontSize: 22, color: INK, lineHeight: 26 }}>{level}</Text>
      <Text style={{ fontWeight: '700', fontSize: 10, color: COLORS.yellowDark, textTransform: 'uppercase', letterSpacing: 0.5 }}>LV</Text>
    </View>
  );
}

// ── XP coin chip ──────────────────────────────────────────────────────────────
export function XPChip({ amount, style }) {
  return (
    <View style={[{
      flexDirection: 'row', alignItems: 'center', gap: 5,
      backgroundColor: COLORS.yellowMid,
      borderRadius: 999,
      borderWidth: 2,
      borderColor: INK,
      paddingVertical: 5,
      paddingHorizontal: 10,
    }, style]}>
      <View style={{
        width: 16, height: 16, borderRadius: 8,
        backgroundColor: COLORS.yellowDeep,
        borderWidth: 2, borderColor: INK,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Text style={{ fontSize: 7, fontWeight: '800', color: INK }}>XP</Text>
      </View>
      <Text style={{ fontWeight: '800', fontSize: 13, color: INK }}>{amount.toLocaleString()}</Text>
    </View>
  );
}

// ── Difficulty chip ────────────────────────────────────────────────────────────
export function DiffChip({ label, variant = 'green' }) {
  const bg = { green: COLORS.green, blue: COLORS.blue, red: COLORS.redDeep }[variant] || COLORS.green;
  return (
    <View style={{
      backgroundColor: bg,
      borderRadius: 999,
      borderWidth: 2,
      borderColor: INK,
      paddingVertical: 2,
      paddingHorizontal: 8,
    }}>
      <Text style={{ fontSize: 10, fontWeight: '700', color: COLORS.white }}>{label}</Text>
    </View>
  );
}

// ── Streak badge ──────────────────────────────────────────────────────────────
export function StreakBadge({ count }) {
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', gap: 4,
      backgroundColor: '#FEF3C7',
      borderRadius: 12,
      borderWidth: 2,
      borderColor: INK,
      paddingVertical: 4,
      paddingHorizontal: 8,
    }}>
      <Text style={{ fontSize: 14 }}>🔥</Text>
      <Text style={{ fontWeight: '800', fontSize: 14, color: INK }}>{count}일</Text>
    </View>
  );
}
