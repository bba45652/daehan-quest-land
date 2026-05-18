import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { COLORS, INK } from '../styles/theme';
import { GCard, LevelBadge, XPBar } from '../components/GameUI';
import { useGame } from '../context/GameContext';

function BadgeIcon({ kind, earned, size = 52 }) {
  const fill = earned ? '#FAC515' : '#D0D5DD';
  const stroke = INK;
  const op = earned ? 1 : 0.4;

  const icons = {
    star:   <Path d="M 32 4 L 40 24 L 60 26 L 45 40 L 50 60 L 32 50 L 14 60 L 19 40 L 4 26 L 24 24 Z" fill={fill} stroke={stroke} strokeWidth="3" strokeLinejoin="round"/>,
    flame:  <Path d="M 32 4 Q 14 24 18 40 Q 20 56 32 60 Q 46 56 48 40 Q 50 30 40 22 Q 36 30 32 26 Q 30 16 32 4 Z" fill={fill} stroke={stroke} strokeWidth="3" strokeLinejoin="round"/>,
    bolt:   <Path d="M 36 4 L 14 36 L 28 36 L 24 60 L 50 28 L 36 28 Z" fill={fill} stroke={stroke} strokeWidth="3" strokeLinejoin="round"/>,
    book:   <><Rect x="8" y="10" width="48" height="44" rx="4" fill={fill} stroke={stroke} strokeWidth="3"/><Line x1="32" y1="10" x2="32" y2="54" stroke={stroke} strokeWidth="3"/></>,
    tooth:  <Path d="M 14 12 Q 8 12 10 22 L 18 50 Q 20 58 24 58 Q 28 58 30 50 L 32 38 Q 34 32 36 38 L 38 50 Q 40 58 44 58 Q 48 58 50 50 L 56 22 Q 58 12 50 12 Q 40 16 32 16 Q 24 16 14 12 Z" fill={fill} stroke={stroke} strokeWidth="3" strokeLinejoin="round"/>,
    crown:  <Path d="M 8 22 L 18 38 L 26 18 L 32 44 L 38 18 L 46 38 L 56 22 L 52 54 L 12 54 Z" fill={fill} stroke={stroke} strokeWidth="3" strokeLinejoin="round"/>,
    shield: <><Path d="M 32 4 L 56 12 L 54 36 Q 50 54 32 60 Q 14 54 10 36 L 8 12 Z" fill={fill} stroke={stroke} strokeWidth="3" strokeLinejoin="round"/><Path d="M 22 30 l 8 8 l 14 -16" stroke={stroke} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></>,
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" opacity={op}>
      {icons[kind] || icons.star}
    </Svg>
  );
}

export default function BadgesScreen() {
  const { state, xpProgress, xpCurrent, xpNeeded } = useGame();
  const { player, badges, questHistory } = state;

  const earned = badges.filter((b) => b.earned);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <LinearGradient colors={['#ffffff', '#EAF4FF', '#DCEBFF']} style={StyleSheet.absoluteFill} locations={[0, 0.4, 1]} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Text style={styles.title}>나의 뱃지 🏆</Text>

        {/* Player summary */}
        <GCard>
          <LinearGradient
            colors={['#EAF7FF', '#D1E9FF']}
            style={{ borderRadius: 19, padding: 16, gap: 12 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <LevelBadge level={player.level} />
              <View>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.playerTitle}>{player.title}</Text>
              </View>
              <View style={{ marginLeft: 'auto', alignItems: 'flex-end', gap: 2 }}>
                <Text style={styles.statLabel}>총 XP</Text>
                <Text style={styles.statValue}>{player.totalXP.toLocaleString()}</Text>
              </View>
            </View>

            {/* XP bar */}
            <View style={{ gap: 4 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.xpLabel}>다음 레벨까지</Text>
                <Text style={styles.xpLabel}>{xpCurrent} / {xpNeeded} XP</Text>
              </View>
              <XPBar progress={xpProgress} variant="blue" />
            </View>

            {/* Stats row */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {[
                { label: '🔥 스트릭', value: `${player.streak}일` },
                { label: '✅ 완료', value: `${questHistory.length}개` },
                { label: '🏅 뱃지', value: `${earned.length}/${badges.length}` },
              ].map((s) => (
                <View key={s.label} style={styles.statCard}>
                  <Text style={styles.statCardLabel}>{s.label}</Text>
                  <Text style={styles.statCardValue}>{s.value}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </GCard>

        {/* Badges grid */}
        <Text style={styles.sectionTitle}>획득한 뱃지</Text>
        <View style={styles.badgeGrid}>
          {badges.map((badge) => (
            <GCard key={badge.id} style={{ alignItems: 'center', padding: 14, gap: 8, flex: 1, opacity: badge.earned ? 1 : 0.6 }}>
              <BadgeIcon kind={badge.kind} earned={badge.earned} size={52} />
              <Text style={styles.badgeTitle}>{badge.title}</Text>
              <Text style={styles.badgeCondition}>{badge.condition}</Text>
              {badge.earned && (
                <View style={styles.earnedPill}>
                  <Text style={styles.earnedText}>✓ 획득!</Text>
                </View>
              )}
            </GCard>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgCanvas },
  scroll: { paddingHorizontal: 16, paddingTop: 12, gap: 16 },
  title: { fontSize: 26, fontWeight: '900', color: INK },
  playerName: { fontSize: 20, fontWeight: '900', color: INK },
  playerTitle: { fontSize: 12, fontWeight: '600', color: '#1B3A6B' },
  statLabel: { fontSize: 10, fontWeight: '700', color: '#1B3A6B', textTransform: 'uppercase' },
  statValue: { fontSize: 18, fontWeight: '900', color: INK },
  xpLabel: { fontSize: 11, fontWeight: '700', color: '#1B3A6B' },
  statCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 12, borderWidth: 2, borderColor: INK, padding: 8, alignItems: 'center', gap: 2 },
  statCardLabel: { fontSize: 10, fontWeight: '600', color: '#1B3A6B' },
  statCardValue: { fontSize: 15, fontWeight: '900', color: INK },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: INK },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  badgeTitle: { fontSize: 12, fontWeight: '800', color: INK, textAlign: 'center' },
  badgeCondition: { fontSize: 10, fontWeight: '500', color: '#1B3A6B', textAlign: 'center' },
  earnedPill: { backgroundColor: COLORS.greenTint, borderRadius: 999, borderWidth: 2, borderColor: COLORS.greenDeep, paddingVertical: 2, paddingHorizontal: 8 },
  earnedText: { fontSize: 10, fontWeight: '800', color: COLORS.greenDeep },
});
