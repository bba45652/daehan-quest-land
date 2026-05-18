import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, INK } from '../styles/theme';
import { Btn3D } from '../components/GameUI';
import { HeroChar } from '../components/HeroChar';

export default function LevelUpScreen({ route, navigation }) {
  const { level = 4, title = '퀘스트 전사' } = route.params || {};
  const scale = useRef(new Animated.Value(0)).current;
  const starAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1, friction: 4, tension: 60, useNativeDriver: true }),
      Animated.timing(starAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const stars = Array.from({ length: 30 }).map((_, i) => ({
    left: `${(i * 37) % 100}%`,
    top:  `${(i * 53) % 90 + 5}%`,
    fontSize: 8 + (i % 5) * 3,
    color: i % 3 === 0 ? '#FAC515' : 'white',
    delay: (i * 0.13) % 2,
  }));

  const confettiColors = ['#2E90FA', '#32D583', '#FAC515', '#F97066', '#9B8AFB', '#FDE272'];
  const confetti = Array.from({ length: 24 }).map((_, i) => ({
    color: confettiColors[i % confettiColors.length],
    left: `${(i * 37) % 100}%`,
    top: `${(i * 19) % 80}%`,
    size: 8 + (i % 4) * 3,
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#6941C6', '#2F1C6A', '#0B2545']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}
      />

      {/* Stars background */}
      {stars.map((s, i) => (
        <Text key={i} style={[styles.star, { left: s.left, top: s.top, fontSize: s.fontSize, color: s.color }]}>✦</Text>
      ))}

      {/* Confetti */}
      {confetti.map((c, i) => (
        <View key={i} style={[styles.confetti, {
          left: c.left, top: c.top,
          width: c.size, height: c.size,
          backgroundColor: c.color,
          borderRadius: i % 3 === 0 ? c.size / 2 : 2,
          transform: [{ rotate: `${i * 17}deg` }],
        }]} />
      ))}

      <Animated.View style={[styles.content, { transform: [{ scale }] }]}>
        {/* Level up label */}
        <View style={styles.levelUpLabel}>
          <Text style={styles.levelUpText}>⬆ 레벨 업!</Text>
        </View>

        {/* New level */}
        <View style={styles.levelBubble}>
          <Text style={styles.levelNum}>{level}</Text>
          <Text style={styles.levelLV}>LV</Text>
        </View>

        {/* Title */}
        <Text style={styles.newTitle}>"{title}"</Text>
        <Text style={styles.congratsText}>축하해! 새 칭호를 얻었어!</Text>

        {/* Hero */}
        <View style={{ marginVertical: 8 }}>
          <HeroChar size={120} mood="cheer" accent={COLORS.yellowMid} />
        </View>

        {/* Rewards */}
        <View style={styles.rewardsRow}>
          {[
            { emoji: '🌟', label: '새 칭호 획득' },
            { emoji: '🎁', label: '보너스 XP' },
            { emoji: '🔓', label: '새 아이템 해금' },
          ].map((r) => (
            <View key={r.label} style={styles.rewardItem}>
              <Text style={{ fontSize: 24 }}>{r.emoji}</Text>
              <Text style={styles.rewardLabel}>{r.label}</Text>
            </View>
          ))}
        </View>

        <Btn3D
          label="계속 하기!"
          variant="yellow"
          size="lg"
          style={{ width: '100%', marginTop: 8 }}
          onPress={() => navigation.navigate('Home')}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  star: { position: 'absolute', opacity: 0.7 },
  confetti: { position: 'absolute', opacity: 0.85 },
  content: { alignItems: 'center', paddingHorizontal: 32, gap: 12, width: '100%' },
  levelUpLabel: { backgroundColor: COLORS.yellowMid, borderRadius: 999, borderWidth: 3, borderColor: COLORS.yellowDark, paddingVertical: 8, paddingHorizontal: 20, shadowColor: COLORS.yellowDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0 },
  levelUpText: { fontSize: 18, fontWeight: '900', color: INK, letterSpacing: -0.5 },
  levelBubble: { width: 120, height: 120, borderRadius: 60, backgroundColor: COLORS.yellowMid, borderWidth: 4, borderColor: INK, alignItems: 'center', justifyContent: 'center', shadowColor: COLORS.yellowDark, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 1, shadowRadius: 0, elevation: 8 },
  levelNum: { fontSize: 52, fontWeight: '900', color: INK, lineHeight: 56 },
  levelLV: { fontSize: 14, fontWeight: '900', color: COLORS.yellowDark, marginTop: -6 },
  newTitle: { fontSize: 22, fontWeight: '900', color: COLORS.white, textAlign: 'center' },
  congratsText: { fontSize: 14, fontWeight: '700', color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  rewardsRow: { flexDirection: 'row', gap: 10, width: '100%' },
  rewardItem: { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', padding: 12, alignItems: 'center', gap: 6 },
  rewardLabel: { fontSize: 10, fontWeight: '700', color: COLORS.white, textAlign: 'center' },
});
