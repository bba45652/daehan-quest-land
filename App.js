import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from './src/context/GameContext';
import HomeScreen from './src/screens/HomeScreen';
import QuestScreen from './src/screens/QuestScreen';
import ShopScreen from './src/screens/ShopScreen';
import BadgesScreen from './src/screens/BadgesScreen';
import ParentScreen from './src/screens/ParentScreen';
import QuestCompleteScreen from './src/screens/QuestCompleteScreen';
import LevelUpScreen from './src/screens/LevelUpScreen';
import { COLORS } from './src/styles/theme';

const INK = '#0B2545';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Chunky bottom tab bar matching Claude Design
function TabBar({ state, descriptors, navigation }) {
  const items = [
    { name: 'Home',   label: '홈',    icon: 'home'   },
    { name: 'Quest',  label: '퀘스트', icon: 'quest'  },
    { name: 'Shop',   label: '상점',   icon: 'shop'   },
    { name: 'Badges', label: '뱃지',   icon: 'badges' },
  ];

  function GIcon({ name, size = 18, color = INK }) {
    const sw = 2.4;
    switch (name) {
      case 'home':
        return <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M 4 11 L 12 4 L 20 11 V 20 H 14 V 14 H 10 V 20 H 4 Z" fill="none" stroke={color} strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round"/></Svg>;
      case 'quest':
        return <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M 4 6 H 16 L 20 12 L 16 18 H 4 Z" fill="none" stroke={color} strokeWidth={sw} strokeLinejoin="round"/><Circle cx="10" cy="12" r="2" fill={color}/></Svg>;
      case 'shop':
        return <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M 4 8 L 6 4 H 18 L 20 8 M 4 8 V 20 H 20 V 8 M 4 8 H 20" stroke={color} strokeWidth={sw} fill="none" strokeLinejoin="round"/><Path d="M 9 12 a 3 3 0 0 0 6 0" stroke={color} strokeWidth={sw} fill="none"/></Svg>;
      case 'badges':
        return <Svg width={size} height={size} viewBox="0 0 24 24"><Circle cx="12" cy="10" r="6" stroke={color} strokeWidth={sw} fill="none"/><Path d="M 8 14 L 6 22 L 12 19 L 18 22 L 16 14" stroke={color} strokeWidth={sw} fill="none" strokeLinejoin="round"/></Svg>;
      default:
        return null;
    }
  }

  return (
    <View style={tabStyles.container}>
      <View style={tabStyles.bar}>
        {items.map((item, index) => {
          const route = state.routes.find((r) => r.name === item.name);
          const focused = state.index === state.routes.indexOf(route);
          return (
            <TouchableOpacity
              key={item.name}
              onPress={() => navigation.navigate(item.name)}
              style={[tabStyles.item, focused && tabStyles.itemActive]}
              activeOpacity={0.7}
            >
              <View style={[tabStyles.iconWrap, focused && tabStyles.iconWrapActive]}>
                <GIcon name={item.icon} size={18} color={focused ? COLORS.white : INK} />
              </View>
              <Text style={[tabStyles.label, focused && tabStyles.labelActive]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  container: { paddingHorizontal: 12, paddingBottom: 24, paddingTop: 8, backgroundColor: 'transparent' },
  bar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: INK,
    padding: 8,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  item: { flex: 1, alignItems: 'center', gap: 2, paddingVertical: 6, borderRadius: 16 },
  itemActive: { backgroundColor: '#D1E9FF' },
  iconWrap: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
  iconWrapActive: { backgroundColor: COLORS.blue, borderWidth: 2, borderColor: INK, shadowColor: COLORS.blueDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 0, elevation: 3 },
  label: { fontSize: 10, fontWeight: '700', color: '#1B3A6B' },
  labelActive: { color: COLORS.blueDeep, fontWeight: '800' },
});

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home"   component={HomeScreen}   />
      <Tab.Screen name="Quest"  component={QuestScreen}  />
      <Tab.Screen name="Shop"   component={ShopScreen}   />
      <Tab.Screen name="Badges" component={BadgesScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <GameProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main"          component={MainTabs} />
            <Stack.Screen name="Parent"        component={ParentScreen} />
            <Stack.Screen
              name="QuestComplete"
              component={QuestCompleteScreen}
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen
              name="LevelUp"
              component={LevelUpScreen}
              options={{ presentation: 'modal' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </GameProvider>
    </SafeAreaProvider>
  );
}
