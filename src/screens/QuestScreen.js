import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, INK, QUEST_TYPES, DIFFICULTY } from '../styles/theme';
import { GCard, XPBar, XPChip, DiffChip, Btn3D } from '../components/GameUI';
import { useGame } from '../context/GameContext';

const QUEST_EMOJIS = { study: '📚', health: '🦷', reading: '📖', prep: '🎒', exercise: '⚽', water: '💧', chores: '🏠', creative: '🎨' };

export default function QuestScreen({ navigation }) {
  const { state, completeQuest, completedCount, totalCount, dailyProgress } = useGame();
  const { quests, player } = state;
  const [completing, setCompleting] = useState(null);

  function handleComplete(quest) {
    if (quest.completed) return;
    Alert.alert(
      '퀘스트 완료! 🎉',
      `"${quest.title}" 퀘스트를 완료했나요?\n+${quest.xp} XP를 받아요!`,
      [
        { text: '아니요', style: 'cancel' },
        {
          text: '완료!', onPress: () => {
            completeQuest(quest.id);
            navigation.navigate('QuestComplete', { quest });
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <LinearGradient colors={['#ffffff', '#EAF4FF', '#DCEBFF']} style={StyleSheet.absoluteFill} locations={[0, 0.4, 1]} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={styles.dateLabel}>오늘의 퀘스트</Text>
            <Text style={styles.title}>퀘스트 목록</Text>
          </View>
          <XPChip amount={player.totalXP} />
        </View>

        {/* Progress card */}
        <GCard>
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
                  {completedCount === totalCount ? '모든 퀘스트 완료! 🎉'
                    : `${totalCount - completedCount}개 남았어!`}
                </Text>
                <XPBar progress={dailyProgress} variant="green" />
                {completedCount < totalCount && (
                  <Text style={styles.hintText}>모두 완료하면 보너스 +50 XP 🎁</Text>
                )}
              </View>
            </View>
          </LinearGradient>
        </GCard>

        {/* Quest list */}
        <View style={{ gap: 12, marginTop: 14 }}>
          {quests.map((quest) => {
            const qType = QUEST_TYPES[quest.type] || QUEST_TYPES.study;
            const diff = DIFFICULTY[quest.difficulty] || DIFFICULTY.medium;
            const emoji = QUEST_EMOJIS[quest.type] || '⭐';

            return (
              <GCard key={quest.id} bg={quest.completed ? COLORS.bgSubtle : quest.special ? undefined : COLORS.white}>
                {quest.special && !quest.completed && (
                  <View style={styles.specialBadge}>
                    <Text style={styles.specialBadgeText}>⭐ 스페셜</Text>
                  </View>
                )}
                {quest.special ? (
                  <LinearGradient colors={['#FFF8E1', '#FFE0B5']} style={{ borderRadius: 19, padding: 14 }}>
                    <QuestCardInner quest={quest} qType={qType} diff={diff} emoji={emoji} onComplete={() => handleComplete(quest)} />
                  </LinearGradient>
                ) : (
                  <View style={{ padding: 14 }}>
                    <QuestCardInner quest={quest} qType={qType} diff={diff} emoji={emoji} onComplete={() => handleComplete(quest)} />
                  </View>
                )}
              </GCard>
            );
          })}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function QuestCardInner({ quest, qType, diff, emoji, onComplete }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
      {/* Icon */}
      <View style={[styles.questIcon, { backgroundColor: qType.tint }]}>
        <Text style={{ fontSize: 28 }}>{emoji}</Text>
      </View>

      {/* Content */}
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={[styles.questTitle, quest.completed && { textDecorationLine: 'line-through', color: '#8888AA' }]}>
          {quest.title}
        </Text>
        <Text style={styles.questSub}>{quest.sub}</Text>
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
          <DiffChip label={diff.label} variant={{ easy: 'green', medium: 'blue', hard: 'red' }[quest.difficulty] || 'blue'} />
          <View style={styles.xpPill}>
            <View style={styles.xpCoin}><Text style={{ fontSize: 7, fontWeight: '800', color: INK }}>XP</Text></View>
            <Text style={{ fontSize: 11, fontWeight: '700', color: INK }}>+{quest.xp}</Text>
          </View>
        </View>
        {quest.progress !== undefined && (
          <XPBar progress={quest.progress} variant="blue" height={12} />
        )}
      </View>

      {/* Action */}
      <View style={{ alignSelf: 'center' }}>
        {quest.completed ? (
          <View style={styles.doneBtn}>
            <Text style={{ color: 'white', fontWeight: '900', fontSize: 18 }}>✓</Text>
          </View>
        ) : (
          <Btn3D label="시작" variant="green" size="sm" onPress={onComplete} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgCanvas },
  scroll: { paddingHorizontal: 16, paddingTop: 12, gap: 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  dateLabel: { fontSize: 11, fontWeight: '700', color: '#1B3A6B', textTransform: 'uppercase', letterSpacing: 0.8 },
  title: { fontSize: 24, fontWeight: '900', color: INK },
  progressCircle: { width: 64, height: 64, borderRadius: 22, backgroundColor: COLORS.green, borderWidth: 3, borderColor: INK, alignItems: 'center', justifyContent: 'center', shadowColor: COLORS.greenDark, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 1, shadowRadius: 0 },
  progressCircleText: { fontSize: 18, fontWeight: '900', color: COLORS.white },
  progressTitle: { fontSize: 15, fontWeight: '800', color: INK },
  hintText: { fontSize: 11, fontWeight: '700', color: '#1B3A6B' },
  questIcon: { width: 56, height: 56, borderRadius: 18, borderWidth: 2.5, borderColor: INK, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  questTitle: { fontSize: 15, fontWeight: '800', color: INK, lineHeight: 20 },
  questSub: { fontSize: 11, fontWeight: '500', color: '#1B3A6B' },
  xpPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.white, borderRadius: 999, borderWidth: 2, borderColor: INK, paddingVertical: 2, paddingHorizontal: 8 },
  xpCoin: { width: 14, height: 14, borderRadius: 7, backgroundColor: COLORS.yellowMid, borderWidth: 1.5, borderColor: INK, alignItems: 'center', justifyContent: 'center' },
  doneBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: COLORS.green, borderWidth: 2.5, borderColor: INK, alignItems: 'center', justifyContent: 'center', shadowColor: COLORS.greenDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 0 },
  specialBadge: { position: 'absolute', top: -12, right: 14, zIndex: 10, backgroundColor: COLORS.yellowMid, borderRadius: 999, borderWidth: 2, borderColor: INK, paddingVertical: 3, paddingHorizontal: 8 },
  specialBadgeText: { fontSize: 10, fontWeight: '800', color: INK },
});
