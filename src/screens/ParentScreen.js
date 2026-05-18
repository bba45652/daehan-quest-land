import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, INK } from '../styles/theme';
import { GCard, Btn3D } from '../components/GameUI';
import { useGame } from '../context/GameContext';

export default function ParentScreen({ navigation }) {
  const { state, addReward, deleteReward, addQuest } = useGame();
  const { player, rewards, badges, questHistory } = state;

  const [pin, setPin] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [showAddReward, setShowAddReward] = useState(false);
  const [showAddQuest, setShowAddQuest] = useState(false);
  const [newReward, setNewReward] = useState({ name: '', emoji: '🎁', cost: '' });
  const [newQuest, setNewQuest] = useState({ title: '', sub: '', type: 'study', difficulty: 'medium', xp: 20, isDaily: true });

  function checkPin() {
    if (pin === state.parentPin) {
      setUnlocked(true);
    } else {
      Alert.alert('핀 오류', '올바른 핀 번호를 입력해주세요.');
      setPin('');
    }
  }

  function handleAddReward() {
    if (!newReward.name || !newReward.cost) {
      Alert.alert('입력 오류', '이름과 XP 비용을 모두 입력해주세요.');
      return;
    }
    addReward({ ...newReward, cost: parseInt(newReward.cost) || 100, category: 'custom' });
    setNewReward({ name: '', emoji: '🎁', cost: '' });
    setShowAddReward(false);
    Alert.alert('완료', '새 보상이 추가되었어요!');
  }

  function handleAddQuest() {
    if (!newQuest.title) {
      Alert.alert('입력 오류', '퀘스트 제목을 입력해주세요.');
      return;
    }
    addQuest(newQuest);
    setNewQuest({ title: '', sub: '', type: 'study', difficulty: 'medium', xp: 20, isDaily: true });
    setShowAddQuest(false);
    Alert.alert('완료', '새 퀘스트가 추가되었어요!');
  }

  if (!unlocked) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <LinearGradient colors={['#ffffff', '#EAF4FF', '#DCEBFF']} style={StyleSheet.absoluteFill} locations={[0, 0.4, 1]} />
        <View style={styles.pinContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={{ fontSize: 18, color: INK }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 32 }}>👨‍👩‍👧‍👦</Text>
          <Text style={styles.pinTitle}>부모 관리 화면</Text>
          <Text style={styles.pinSub}>핀 번호를 입력해주세요 (기본: 1234)</Text>
          <View style={styles.pinInputRow}>
            <TextInput
              value={pin}
              onChangeText={setPin}
              keyboardType="numeric"
              secureTextEntry
              maxLength={4}
              placeholder="••••"
              placeholderTextColor="#B0B0C0"
              style={styles.pinInput}
            />
          </View>
          <Btn3D label="확인" variant="blue" size="lg" onPress={checkPin} style={{ width: 200 }} />
        </View>
      </SafeAreaView>
    );
  }

  const completedToday = questHistory.filter((q) => {
    const today = new Date().toDateString();
    return q.completedAt && new Date(q.completedAt).toDateString() === today;
  }).length;

  const earnedBadges = badges.filter((b) => b.earned).length;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <LinearGradient colors={['#ffffff', '#EAF4FF', '#DCEBFF']} style={StyleSheet.absoluteFill} locations={[0, 0.4, 1]} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtnSmall}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: INK }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>부모 관리 화면</Text>
        </View>

        {/* Stats cards */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {[
            { label: '현재 레벨', value: `Lv.${player.level}`, emoji: '⭐' },
            { label: '총 XP', value: player.totalXP.toLocaleString(), emoji: '🪙' },
            { label: '오늘 완료', value: `${completedToday}개`, emoji: '✅' },
            { label: '뱃지', value: `${earnedBadges}개`, emoji: '🏅' },
          ].map((s) => (
            <GCard key={s.label} style={{ flex: 1, padding: 10, alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 18 }}>{s.emoji}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </GCard>
          ))}
        </View>

        {/* Streak info */}
        <GCard>
          <LinearGradient colors={['#FEF7C3', '#FDE272']} style={{ borderRadius: 19, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Text style={{ fontSize: 36 }}>🔥</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.streakTitle}>{player.streak}일 연속 스트릭!</Text>
              <Text style={styles.streakSub}>아이가 매일 퀘스트를 완료하고 있어요</Text>
            </View>
          </LinearGradient>
        </GCard>

        {/* Manage rewards */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>보상 관리</Text>
          <TouchableOpacity onPress={() => setShowAddReward(true)} style={styles.addBtn}>
            <Text style={styles.addBtnText}>+ 추가</Text>
          </TouchableOpacity>
        </View>

        <View style={{ gap: 8 }}>
          {rewards.map((reward) => (
            <GCard key={reward.id}>
              <View style={styles.rewardRow}>
                <Text style={{ fontSize: 24 }}>{reward.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rewardName}>{reward.name}</Text>
                  <Text style={styles.rewardCost}>{reward.cost.toLocaleString()} XP</Text>
                </View>
                <TouchableOpacity
                  onPress={() => Alert.alert('삭제', `"${reward.name}" 보상을 삭제할까요?`, [
                    { text: '취소', style: 'cancel' },
                    { text: '삭제', style: 'destructive', onPress: () => deleteReward(reward.id) },
                  ])}
                  style={styles.deleteBtn}
                >
                  <Text style={{ color: COLORS.redDeep, fontWeight: '700', fontSize: 18 }}>✕</Text>
                </TouchableOpacity>
              </View>
            </GCard>
          ))}
        </View>

        {/* Manage quests */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>퀘스트 관리</Text>
          <TouchableOpacity onPress={() => setShowAddQuest(true)} style={styles.addBtn}>
            <Text style={styles.addBtnText}>+ 추가</Text>
          </TouchableOpacity>
        </View>

        <GCard style={{ padding: 14 }}>
          <Text style={styles.aiTitle}>🤖 AI 추천</Text>
          <Text style={styles.aiSub}>아이 성향에 맞는 퀘스트를 AI가 자동 추천해드려요.</Text>
          <Btn3D
            label="AI 퀘스트 추천 받기"
            variant="purple"
            size="sm"
            style={{ marginTop: 10, alignSelf: 'flex-start' }}
            onPress={() => Alert.alert('AI 추천', '곧 출시 예정이에요! 아이의 습관 데이터를 분석해 최적의 퀘스트를 추천할게요.')}
          />
        </GCard>

        {/* Quest history */}
        <Text style={styles.sectionTitle}>최근 완료 퀘스트</Text>
        {questHistory.length === 0 ? (
          <GCard style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: '#8888AA', fontWeight: '600' }}>아직 완료된 퀘스트가 없어요</Text>
          </GCard>
        ) : (
          <View style={{ gap: 8 }}>
            {questHistory.slice(0, 5).map((q, i) => (
              <GCard key={i}>
                <View style={styles.historyRow}>
                  <Text style={{ fontSize: 18 }}>✅</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.historyTitle}>{q.title}</Text>
                    <Text style={styles.historyDate}>{new Date(q.completedAt).toLocaleDateString('ko-KR')}</Text>
                  </View>
                  <Text style={styles.historyXP}>+{q.xp} XP</Text>
                </View>
              </GCard>
            ))}
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Add Reward Modal */}
      <Modal visible={showAddReward} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <GCard style={{ padding: 20, gap: 14, width: '90%' }}>
            <Text style={styles.modalTitle}>새 보상 추가</Text>
            <View style={styles.inputRow}>
              <TextInput
                value={newReward.emoji}
                onChangeText={(v) => setNewReward({ ...newReward, emoji: v })}
                style={[styles.input, { width: 60, textAlign: 'center', fontSize: 24 }]}
                maxLength={2}
              />
              <TextInput
                value={newReward.name}
                onChangeText={(v) => setNewReward({ ...newReward, name: v })}
                placeholder="보상 이름"
                style={[styles.input, { flex: 1 }]}
              />
            </View>
            <TextInput
              value={newReward.cost}
              onChangeText={(v) => setNewReward({ ...newReward, cost: v })}
              placeholder="XP 비용 (예: 500)"
              keyboardType="numeric"
              style={styles.input}
            />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Btn3D label="취소" variant="ghost" size="sm" style={{ flex: 1 }} onPress={() => setShowAddReward(false)} />
              <Btn3D label="추가" variant="blue" size="sm" style={{ flex: 1 }} onPress={handleAddReward} />
            </View>
          </GCard>
        </View>
      </Modal>

      {/* Add Quest Modal */}
      <Modal visible={showAddQuest} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <GCard style={{ padding: 20, gap: 14, width: '90%' }}>
            <Text style={styles.modalTitle}>새 퀘스트 추가</Text>
            <TextInput value={newQuest.title} onChangeText={(v) => setNewQuest({ ...newQuest, title: v })} placeholder="퀘스트 제목" style={styles.input} />
            <TextInput value={newQuest.sub} onChangeText={(v) => setNewQuest({ ...newQuest, sub: v })} placeholder="설명 (선택)" style={styles.input} />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {['easy', 'medium', 'hard'].map((d) => (
                <TouchableOpacity
                  key={d}
                  onPress={() => setNewQuest({ ...newQuest, difficulty: d, xp: { easy: 10, medium: 25, hard: 40 }[d] })}
                  style={[styles.diffBtn, newQuest.difficulty === d && styles.diffBtnActive]}
                >
                  <Text style={{ fontSize: 11, fontWeight: '700', color: newQuest.difficulty === d ? COLORS.white : INK }}>
                    {{ easy: '쉬움', medium: '보통', hard: '어려움' }[d]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Btn3D label="취소" variant="ghost" size="sm" style={{ flex: 1 }} onPress={() => setShowAddQuest(false)} />
              <Btn3D label="추가" variant="blue" size="sm" style={{ flex: 1 }} onPress={handleAddQuest} />
            </View>
          </GCard>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgCanvas },
  scroll: { paddingHorizontal: 16, paddingTop: 12, gap: 14 },
  pinContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, paddingHorizontal: 32 },
  backBtn: { position: 'absolute', top: 16, left: 16, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  pinTitle: { fontSize: 26, fontWeight: '900', color: INK },
  pinSub: { fontSize: 14, fontWeight: '600', color: '#1B3A6B', textAlign: 'center' },
  pinInputRow: { width: '100%', alignItems: 'center' },
  pinInput: { width: 150, height: 56, backgroundColor: COLORS.white, borderRadius: 16, borderWidth: 3, borderColor: INK, textAlign: 'center', fontSize: 24, fontWeight: '800', color: INK, letterSpacing: 8 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtnSmall: { width: 40, height: 40, backgroundColor: COLORS.white, borderRadius: 12, borderWidth: 2.5, borderColor: INK, alignItems: 'center', justifyContent: 'center', shadowColor: INK, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 0, elevation: 3 },
  title: { fontSize: 22, fontWeight: '900', color: INK },
  statValue: { fontSize: 16, fontWeight: '900', color: INK },
  statLabel: { fontSize: 9, fontWeight: '700', color: '#1B3A6B', textAlign: 'center' },
  streakTitle: { fontSize: 18, fontWeight: '900', color: INK },
  streakSub: { fontSize: 12, fontWeight: '600', color: '#1B3A6B' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: INK },
  addBtn: { backgroundColor: COLORS.blue, borderRadius: 10, borderWidth: 2, borderColor: INK, paddingVertical: 5, paddingHorizontal: 12 },
  addBtnText: { fontSize: 12, fontWeight: '800', color: COLORS.white },
  rewardRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  rewardName: { fontSize: 14, fontWeight: '800', color: INK },
  rewardCost: { fontSize: 11, fontWeight: '600', color: '#1B3A6B' },
  deleteBtn: { width: 36, height: 36, backgroundColor: '#FEE4E2', borderRadius: 10, borderWidth: 2, borderColor: COLORS.redDeep, alignItems: 'center', justifyContent: 'center' },
  aiTitle: { fontSize: 16, fontWeight: '900', color: INK },
  aiSub: { fontSize: 12, fontWeight: '600', color: '#1B3A6B', marginTop: 4 },
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  historyTitle: { fontSize: 13, fontWeight: '700', color: INK },
  historyDate: { fontSize: 11, fontWeight: '500', color: '#1B3A6B' },
  historyXP: { fontSize: 13, fontWeight: '800', color: COLORS.green },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  modalTitle: { fontSize: 20, fontWeight: '900', color: INK },
  inputRow: { flexDirection: 'row', gap: 8 },
  input: { backgroundColor: COLORS.bgSubtle, borderRadius: 12, borderWidth: 2.5, borderColor: INK, paddingVertical: 10, paddingHorizontal: 12, fontSize: 14, fontWeight: '600', color: INK },
  diffBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, borderWidth: 2, borderColor: INK, backgroundColor: COLORS.white, alignItems: 'center' },
  diffBtnActive: { backgroundColor: COLORS.blue },
});
