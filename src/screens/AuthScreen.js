import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, INK } from '../styles/theme';
import { Btn3D } from '../components/GameUI';
import { HeroChar } from '../components/HeroChar';
import { supabase } from '../lib/supabase';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleAuth() {
    if (!email || !password) {
      Alert.alert('입력 오류', '이메일과 비밀번호를 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        Alert.alert('가입 완료! 🎉', '이메일을 확인하거나 바로 로그인해보세요.');
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (e) {
      Alert.alert('오류', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <LinearGradient
        colors={['#ffffff', '#EAF4FF', '#DCEBFF']}
        style={StyleSheet.absoluteFill}
        locations={[0, 0.4, 1]}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <HeroChar size={120} mood="happy" accent={COLORS.blue} />

          <Text style={styles.title}>대한 퀘스트 랜드</Text>
          <Text style={styles.subtitle}>{isSignUp ? '새 계정 만들기' : '로그인하고 퀘스트 시작!'}</Text>

          <View style={styles.card}>
            <Text style={styles.label}>이메일</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="example@email.com"
              placeholderTextColor="#B0B0C0"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            <Text style={[styles.label, { marginTop: 12 }]}>비밀번호</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="6자 이상"
              placeholderTextColor="#B0B0C0"
              secureTextEntry
              style={styles.input}
            />

            <Btn3D
              label={loading ? '처리 중...' : isSignUp ? '회원가입' : '로그인'}
              variant="blue"
              size="lg"
              style={{ marginTop: 20 }}
              onPress={handleAuth}
            />
          </View>

          <Btn3D
            label={isSignUp ? '이미 계정이 있어요 → 로그인' : '계정이 없어요 → 회원가입'}
            variant="ghost"
            size="sm"
            style={{ marginTop: 12 }}
            onPress={() => setIsSignUp(!isSignUp)}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgCanvas },
  container: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40, gap: 8 },
  title: { fontSize: 28, fontWeight: '900', color: INK, marginTop: 12 },
  subtitle: { fontSize: 14, fontWeight: '600', color: '#1B3A6B', marginBottom: 8 },
  card: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: INK,
    padding: 20,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 0,
    elevation: 5,
    marginTop: 8,
  },
  label: { fontSize: 13, fontWeight: '700', color: INK, marginBottom: 6 },
  input: {
    backgroundColor: COLORS.bgSubtle,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: INK,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '600',
    color: INK,
  },
});
