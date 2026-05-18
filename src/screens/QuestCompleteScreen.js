import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, INK } from '../styles/theme';
import { Btn3D } from '../components/GameUI';
import { HeroChar } from '../components/HeroChar';
import { useGame } from '../context/GameContext';

export default function QuestCompleteScreen({ route, navigation }) {
  const quest = route.params?.quest || {};
  const { state } = useGame();
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const confettiColors = ['#2E90FA', '#32D583', '#FAC515', '#F97066', '#9B8AFB', '#FDE272'];
  const confetti = Array.from({ length: 20 }).map((_, i) => ({
    color: confettiColors[i % confettiColors.length],
    left: `${(i * 37) % 100}%`,
    top: `${(i * 53) % 80}%`,
    size: 8 + (i % 4) * 3,
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FEF7C3', '#FAC515', '#F79009']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}
      />

      {/* Confetti */}
      {confetti.map((c, i) => (
        <View key={i} style={[styles.confettiPiece, {
          left: c.left, top: c.top,
          width: c.size, height: c.size,
          backgroundColor: c.color,
          borderRadius: i % 3 === 0 ? c.size / 2 : 2,
          transform: [{ rotate: `${i * 23}deg` }],
        }]} />
      ))}

      <Animated.View style={[styles.content, { opacity, transform: [{ scale }] }]}>
        {/* Stars */}
        <Text style={styles.stars}>✦ ✦ ✦</Text>

        {/* Medal area */}
        <View style={styles.medalWrap}>
          <View style={styles.medal}>
            <Text style={{ fontSize: 48 }}>🏅</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleWrap}>
          <Text style={styles.completeLabel}>퀘스트 완료!</Text>
          <Text style={styles.questName}>"{quest.title}"</Text>
        </View>

        {/* XP gained */}
        <View style={styles.xpCard}>
          <View style={styles.xpRow}>
            <View style={styles.xpCoin}><Text style={{ fontSize: 10, fontWeight: '900', color: INK }}>XP</Text></View>
            <Text style={styles.xpGained}>+{quest.xp}</Text>
          </View>
          <Text style={styles.xpSub}>XP 획득!</Text>
        </View>

        {/* Hero reaction */}
        <View style={styles.heroWrap}>
          <HeroChar size={100} mood="cheer" accent={COLORS.yellowMid} />
        </View>

        {/* Level */}
        <View style={styles.levelRow}>
          <Text style={styles.levelText}>현재 레벨 {state.player.level} — 총 {state.player.totalXP.toLocaleString()} XP</Text>
        </View>

        {/* Buttons */}
        <View style={{ gap: 10, width: '100%', marginTop: 8 }}>
          <Btn3D
            label="퀘스트 더 하기"
            variant="blue"
            size="lg"
            onPress={() => navigation.navigate('Quest')}
          />
          <Btn3D
            label="홈으로"
            variant="ghost"
            size="lg"
            onPress={() => navigation.navigate('Home')}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  confettiPiece: { position: 'absolute', opacity: 0.8 },
  content: { alignItems: 'center', paddingHorizontal: 32, gap: 14, width: '100%' },
  stars: { fontSize: 24, color: COLORS.yellowDark, letterSpacing: 8 },
  medalWrap: { alignItems: 'center' },
  medal: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.white, borderWidth: 4, borderColor: INK, alignItems: 'center', justifyContent: 'center', shadowColor: INK, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 0, elevation: 8 },
  titleWrap: { alignItems: 'center', gap: 4 },
  completeLabel: { fontSize: 32, fontWeight: '900', color: INK, letterSpacing: -1 },
  questName: { fontSize: 16, fontWeight: '700', color: INK, textAlign: 'center', opacity: 0.7 },
  xpCard: { backgroundColor: COLORS.white, borderRadius: 20, borderWidth: 3, borderColor: INK, paddingVertical: 14, paddingHorizontal: 28, alignItems: 'center', gap: 4, shadowColor: INK, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 0, elevation: 4 },
  xpRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  xpCoin: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.yellowMid, borderWidth: 2.5, borderColor: INK, alignItems: 'center', justifyContent: 'center' },
  xpGained: { fontSize: 40, fontWeight: '900', color: COLORS.blue, letterSpacing: -1 },
  xpSub: { fontSize: 14, fontWeight: '700', color: '#1B3A6B' },
  heroWrap: { marginVertical: 4 },
  levelRow: { backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 12, paddingVertical: 6, paddingHorizontal: 14 },
  levelText: { fontSize: 12, fontWeight: '700', color: INK },
});
