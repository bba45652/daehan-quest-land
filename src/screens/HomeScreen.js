import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, INK, QUEST_TYPES } from '../styles/theme';
import { GCard, XPBar, LevelBadge, XPChip, StreakBadge, Btn3D } from '../components/GameUI';
import { HeroChar } from '../components/HeroChar';
import { useGame } from '../context/GameContext';

export default function HomeScreen({ navigation }) {
  const { state, completedCount, totalCount, dailyProgress, xpProgress, xpCurrent, xpNeeded } = useGame();
  const { player, quests } = state;

  const todayQuests = quests.slice(0, 3);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <LinearGradient
        colors={['#ffffff', '#EAF4FF', '#DCEBFF']}
        style={StyleSheet.absoluteFill}
        locations={[0, 0.4, 1]}
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ─────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greet}>안녕, 모험가!</Text>
            <Text style={styles.appTitle}>대한 퀘스트 랜드</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <XPChip amount={player.totalXP} />
            <TouchableOpacity
              onPress={() => navigation.navigate('Parent')}
              style={styles.settingsBtn}
            >
              <Text style={{ fontSize: 20 }}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Player card ─────────────────────────────────────────────── */}
        <GCard style={styles.playerCard}>
          <LinearGradient
            colors={['#EAF7FF', '#D1E9FF']}
            style={styles.playerCardGrad}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          >
            {/* Mascot */}
            <View style={styles.heroWrap}>
              <HeroChar size={100} mood="happy" accent={COLORS.blue} />
            </View>

            {/* Info */}
            <View style={styles.playerInfo}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <LevelBadge level={player.level} />
                <View>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <Text style={styles.playerTitle}>{player.title}</Text>
                </View>
              </View>

              {/* XP bar */}
              <View style={{ marginTop: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={styles.xpLabel}>경험치</Text>
                  <Text style={styles.xpLabel}>{xpCurrent} / {xpNeeded} XP</Text>
                </View>
                <XPBar progress={xpProgress} variant="blue" />
              </View>

              {/* Streak */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 }}>
                <StreakBadge count={player.streak} />
                <Text style={styles.streakLabel}>연속 퀘스트 클리어!</Text>
              </View>
            </View>
          </LinearGradient>
        </GCard>

        {/* ── Daily progress ───────────────────────────────────────────── */}
        <GCard style={{ marginTop: 14 }}>
          <LinearGradient
            colors={['#ECFDF3', '#D1FADF']}
            style={{ borderRadius: 19, padding: 14 }}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={styles.progressCircle}>
                <Text style={styles.progressCircleText}>{completedCount}/{totalCount}</Text>
              </View>
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={styles.progressTitle}>
                  {completedCount === totalCount ? '오늘 퀘스트 완료! 🎉' :
                   completedCount > 0 ? '오늘 거의 다 했어!' : '오늘의 퀘스트 시작!'}
                </Text>
                <XPBar progress={dailyProgress} variant="green" />
                {completedCount < totalCount && (
                  <Text style={styles.progressHint}>
                    {totalCount - completedCount}개만 더 완료하면 보너스 +50 XP 🎁
                  </Text>
                )}
              </View>
            </View>
          </LinearGradient>
        </GCard>

        {/* ── Today's quests preview ───────────────────────────────────── */}
        <View style={{ marginTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.sectionTitle}>오늘의 퀘스트</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Quest')}>
            <Text style={styles.seeAll}>전체 보기 →</Text>
          </TouchableOpacity>
        </View>

        {todayQuests.map((quest) => {
          const qType = QUEST_TYPES[quest.type] || QUEST_TYPES.study;
          return (
            <GCard key={quest.id} style={{ marginTop: 10 }}>
              <View style={[styles.miniQuest, quest.completed && { opacity: 0.55 }]}>
                <View style={[styles.questIcon, { backgroundColor: qType.tint }]}>
                  <Text style={{ fontSize: 22 }}>
                    {{ study: '📚', health: '🦷', reading: '📖', prep: '🎒', exercise: '⚽', water: '💧', chores: '🏠' }[quest.type] || '⭐'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.questTitle, quest.completed && { textDecorationLine: 'line-through' }]}>
                    {quest.title}
                  </Text>
                  <Text style={styles.questSub}>{quest.sub}</Text>
                </View>
                {quest.completed ? (
                  <View style={styles.doneCheck}><Text style={{ color: 'white', fontWeight: '800' }}>✓</Text></View>
                ) : (
                  <Text style={{ fontSize: 12, color: COLORS.blue, fontWeight: '700' }}>+{quest.xp} XP</Text>
                )}
              </View>
            </GCard>
          );
        })}

        <Btn3D
          label="퀘스트 전체 보기"
          variant="blue"
          size="lg"
          style={{ marginTop: 16 }}
          onPress={() => navigation.navigate('Quest')}
        />

        {/* ── Streak week view ─────────────────────────────────────────── */}
        <GCard style={{ marginTop: 16, padding: 14 }}>
          <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>이번 주 스트릭 🔥</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {['월', '화', '수', '목', '금', '토', '일'].map((day, i) => {
              const done = i < player.streak;
              return (
                <View key={day} style={{ alignItems: 'center', gap: 4 }}>
                  <View style={[styles.streakDot, done && styles.streakDotDone]}>
                    {done && <Text style={{ fontSize: 14 }}>🔥</Text>}
                  </View>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: done ? INK : COLORS.inkSoft ?? '#1B3A6B' }}>{day}</Text>
                </View>
              );
            })}
          </View>
        </GCard>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgCanvas },
  scroll: { paddingHorizontal: 16, paddingTop: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  greet: { fontSize: 11, fontWeight: '700', color: '#1B3A6B', textTransform: 'uppercase', letterSpacing: 0.8 },
  appTitle: { fontSize: 26, fontWeight: '900', color: INK, letterSpacing: -0.5 },
  settingsBtn: { width: 44, height: 44, borderRadius: 14, borderWidth: 2.5, borderColor: INK, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', shadowColor: INK, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 0, elevation: 3 },
  playerCard: { overflow: 'hidden' },
  playerCardGrad: { borderRadius: 19, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 14 },
  heroWrap: { flex: '0 0 auto' ?? 0 },
  playerInfo: { flex: 1 },
  playerName: { fontSize: 20, fontWeight: '900', color: INK },
  playerTitle: { fontSize: 11, fontWeight: '600', color: '#1B3A6B' },
  xpLabel: { fontSize: 11, fontWeight: '700', color: '#1B3A6B' },
  streakLabel: { fontSize: 11, fontWeight: '600', color: '#1B3A6B' },
  progressCircle: { width: 64, height: 64, borderRadius: 22, backgroundColor: COLORS.green, borderWidth: 3, borderColor: INK, shadowColor: COLORS.greenDark, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 1, shadowRadius: 0, alignItems: 'center', justifyContent: 'center' },
  progressCircleText: { fontSize: 18, fontWeight: '900', color: COLORS.white },
  progressTitle: { fontSize: 15, fontWeight: '800', color: INK },
  progressHint: { fontSize: 11, fontWeight: '700', color: '#1B3A6B' },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: INK },
  seeAll: { fontSize: 13, fontWeight: '700', color: COLORS.blue },
  miniQuest: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  questIcon: { width: 44, height: 44, borderRadius: 14, borderWidth: 2.5, borderColor: INK, alignItems: 'center', justifyContent: 'center' },
  questTitle: { fontSize: 14, fontWeight: '800', color: INK },
  questSub: { fontSize: 11, fontWeight: '500', color: '#1B3A6B', marginTop: 2 },
  doneCheck: { width: 32, height: 32, borderRadius: 10, backgroundColor: COLORS.green, borderWidth: 2.5, borderColor: INK, alignItems: 'center', justifyContent: 'center' },
  streakDot: { width: 36, height: 36, borderRadius: 12, borderWidth: 2.5, borderColor: INK, backgroundColor: '#D1E9FF', alignItems: 'center', justifyContent: 'center' },
  streakDotDone: { backgroundColor: '#FEF7C3' },
});
