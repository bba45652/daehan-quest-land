import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, INK } from '../styles/theme';
import { GCard, XPChip, Btn3D } from '../components/GameUI';
import { MiniBuddy } from '../components/HeroChar';
import { useGame } from '../context/GameContext';

const TABS = ['친구', '실생활 보상', '아이템'];
const RARITY_STYLE = {
  '커먼': { bg: COLORS.bgSubtle, text: '#667085' },
  '레어': { bg: COLORS.blueTint, text: COLORS.blueDeep },
  '에픽': { bg: '#EDE9FE', text: COLORS.purpleDark },
  '전설': { bg: '#FEF7C3', text: COLORS.yellowDark },
};

export default function ShopScreen() {
  const { state, redeemReward } = useGame();
  const { player, rewards, buddies } = state;
  const [activeTab, setActiveTab] = useState(0);

  function handleRedeem(reward) {
    if (player.totalXP < reward.cost) {
      Alert.alert('XP 부족 😢', `${reward.cost - player.totalXP} XP가 더 필요해요!\n퀘스트를 완료해서 XP를 모아봐요!`);
      return;
    }
    Alert.alert(
      '보상 교환 🎁',
      `"${reward.name}" 보상을 교환할까요?\n${reward.cost} XP가 사용돼요.`,
      [
        { text: '아니요', style: 'cancel' },
        { text: '교환!', onPress: () => redeemReward(reward.id) },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <LinearGradient colors={['#ffffff', '#EAF4FF', '#DCEBFF']} style={StyleSheet.absoluteFill} locations={[0, 0.4, 1]} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>XP 상점</Text>
          <XPChip amount={player.totalXP} />
        </View>

        {/* Tab bar */}
        <View style={styles.tabBar}>
          {TABS.map((tab, i) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(i)}
              style={[styles.tab, activeTab === i && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Featured banner */}
        <GCard style={{ overflow: 'hidden' }}>
          <LinearGradient
            colors={['#2F1C6A', '#6941C6', '#9B8AFB']}
            style={{ borderRadius: 19, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          >
            <MiniBuddy size={56} color="#FAC515" />
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTag}>오늘만!</Text>
              <Text style={styles.bannerTitle}>전설의 알 50% 할인</Text>
              <Text style={styles.bannerSub}>23:14:08 남음</Text>
            </View>
            <Btn3D label="지금!" variant="yellow" size="sm" onPress={() => Alert.alert('준비 중', '곧 출시 예정이에요!')} />
          </LinearGradient>
        </GCard>

        {/* Tab content */}
        {activeTab === 0 && (
          <>
            <Text style={styles.sectionTitle}>내 친구들</Text>
            <View style={styles.buddyGrid}>
              {buddies.map((buddy) => {
                const rarityStyle = RARITY_STYLE[buddy.rarity] || RARITY_STYLE['커먼'];
                return (
                  <GCard key={buddy.id} style={{ overflow: 'visible', flex: 1 }}>
                    {buddy.rarity !== '커먼' && (
                      <View style={[styles.rarityBadge, { backgroundColor: rarityStyle.bg, borderColor: INK }]}>
                        <Text style={[styles.rarityText, { color: rarityStyle.text }]}>{buddy.rarity}</Text>
                      </View>
                    )}
                    <View style={{ padding: 12, alignItems: 'center', gap: 8 }}>
                      <View style={{ position: 'relative' }}>
                        <View style={[styles.buddyBg, { backgroundColor: buddy.color + '33' }, buddy.locked && { opacity: 0.4 }]}>
                          <MiniBuddy size={64} color={buddy.color} />
                        </View>
                        {buddy.locked && (
                          <View style={styles.lockOverlay}>
                            <Text style={{ fontSize: 18 }}>🔒</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.buddyName}>{buddy.name}</Text>
                      {buddy.owned ? (
                        <View style={[styles.ownedBadge]}>
                          <Text style={styles.ownedText}>✓ 보유 중</Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={[styles.buyBtn, player.totalXP < buddy.cost && styles.buyBtnDisabled]}
                          onPress={() => Alert.alert('준비 중', '친구 구매 기능 출시 예정!')}
                        >
                          <View style={styles.xpCoinSm}><Text style={{ fontSize: 7, fontWeight: '800', color: INK }}>XP</Text></View>
                          <Text style={styles.buyBtnText}>{buddy.cost.toLocaleString()}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </GCard>
                );
              })}
            </View>
          </>
        )}

        {activeTab === 1 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>실생활 보상</Text>
              <Text style={styles.sectionSub}>부모님 승인 필요</Text>
            </View>
            <View style={{ gap: 10 }}>
              {rewards.map((reward) => (
                <GCard key={reward.id}>
                  <View style={styles.rewardRow}>
                    <View style={styles.rewardEmoji}>
                      <Text style={{ fontSize: 24 }}>{reward.emoji}</Text>
                    </View>
                    <Text style={styles.rewardName}>{reward.name}</Text>
                    <TouchableOpacity
                      style={[styles.rewardBuyBtn, player.totalXP < reward.cost && styles.rewardBuyBtnDisabled]}
                      onPress={() => handleRedeem(reward)}
                    >
                      <View style={styles.xpCoinSm}><Text style={{ fontSize: 7, fontWeight: '800', color: INK }}>XP</Text></View>
                      <Text style={[styles.rewardBuyText, player.totalXP < reward.cost && { color: '#8888AA' }]}>
                        {reward.cost.toLocaleString()}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </GCard>
              ))}
            </View>
          </>
        )}

        {activeTab === 2 && (
          <View style={styles.comingSoon}>
            <Text style={{ fontSize: 48 }}>🎮</Text>
            <Text style={styles.comingSoonTitle}>아이템 상점</Text>
            <Text style={styles.comingSoonSub}>곧 출시 예정이에요!</Text>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgCanvas },
  scroll: { paddingHorizontal: 16, paddingTop: 12, gap: 14 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: '900', color: INK },
  tabBar: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 18, borderWidth: 3, borderColor: INK, padding: 4, shadowColor: INK, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 14, alignItems: 'center' },
  tabActive: { backgroundColor: COLORS.blue },
  tabText: { fontSize: 12, fontWeight: '800', color: INK },
  tabTextActive: { color: COLORS.white },
  bannerTag: { fontSize: 10, fontWeight: '700', color: '#FDE272', textTransform: 'uppercase', letterSpacing: 0.8 },
  bannerTitle: { fontSize: 16, fontWeight: '900', color: COLORS.white, marginTop: 2 },
  bannerSub: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: INK },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionSub: { fontSize: 11, fontWeight: '700', color: '#1B3A6B' },
  buddyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  buddyBg: { borderRadius: 14, padding: 8, alignItems: 'center', justifyContent: 'center' },
  buddyName: { fontSize: 13, fontWeight: '800', color: INK, textAlign: 'center' },
  rarityBadge: { position: 'absolute', top: -10, left: 8, zIndex: 10, borderRadius: 999, borderWidth: 2, paddingVertical: 2, paddingHorizontal: 8 },
  rarityText: { fontSize: 9, fontWeight: '800' },
  lockOverlay: { position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 14 },
  ownedBadge: { backgroundColor: COLORS.greenTint, borderRadius: 999, borderWidth: 2, borderColor: COLORS.greenDeep, paddingVertical: 4, paddingHorizontal: 10 },
  ownedText: { fontSize: 11, fontWeight: '800', color: COLORS.greenDeep },
  buyBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.yellowMid, borderRadius: 12, borderWidth: 2.5, borderColor: INK, paddingVertical: 7, paddingHorizontal: 10, shadowColor: COLORS.yellowDark, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 1, shadowRadius: 0, elevation: 3, width: '100%', justifyContent: 'center' },
  buyBtnDisabled: { backgroundColor: '#E4E7EC', shadowColor: '#C3CACE' },
  buyBtnText: { fontSize: 12, fontWeight: '800', color: INK },
  xpCoinSm: { width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.yellowDeep, borderWidth: 1.5, borderColor: INK, alignItems: 'center', justifyContent: 'center' },
  rewardRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  rewardEmoji: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FEF7C3', borderWidth: 2.5, borderColor: INK, alignItems: 'center', justifyContent: 'center' },
  rewardName: { flex: 1, fontSize: 15, fontWeight: '800', color: INK },
  rewardBuyBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.yellowMid, borderRadius: 12, borderWidth: 2.5, borderColor: INK, paddingVertical: 8, paddingHorizontal: 12, shadowColor: COLORS.yellowDark, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 1, shadowRadius: 0, elevation: 3 },
  rewardBuyBtnDisabled: { backgroundColor: '#E4E7EC', shadowColor: '#C3CACE' },
  rewardBuyText: { fontSize: 13, fontWeight: '800', color: INK },
  comingSoon: { alignItems: 'center', gap: 8, paddingVertical: 40 },
  comingSoonTitle: { fontSize: 22, fontWeight: '900', color: INK },
  comingSoonSub: { fontSize: 14, fontWeight: '600', color: '#1B3A6B' },
});
