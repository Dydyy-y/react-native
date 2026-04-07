import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { AppTabsParamList, LobbyStackParamList, GameStackParamList, ProfileStackParamList } from './NavigationTypes';
import { ProfileScreen } from '../features/auth';
import {
  LobbyHomeScreen,
  CreateSessionScreen,
  JoinSessionScreen,
  SessionDetailScreen,
} from '../features/lobby';
import { GameScreen, GameOverScreen, GameHistoryScreen } from '../features/game';
import { COLORS } from '../shared/utils/constants';

const Tab = createBottomTabNavigator<AppTabsParamList>();
const LobbyStack = createStackNavigator<LobbyStackParamList>();
const GameStack = createStackNavigator<GameStackParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();

const screenOptions = {
  headerStyle: { backgroundColor: COLORS.surface },
  headerTintColor: COLORS.white,
  headerTitleStyle: { fontWeight: 'bold' as const },
  cardStyle: { backgroundColor: COLORS.background },
};

// Stack Navigator pour le Lobby (4 ecrans)
const LobbyNavigator = () => (
  <LobbyStack.Navigator screenOptions={screenOptions}>
    <LobbyStack.Screen
      name="LobbyHome"
      component={LobbyHomeScreen}
      options={{ headerShown: false }}
    />
    <LobbyStack.Screen
      name="CreateSession"
      component={CreateSessionScreen}
      options={{ title: 'Nouvelle session' }}
    />
    <LobbyStack.Screen
      name="JoinSession"
      component={JoinSessionScreen}
      options={{ title: 'Rejoindre' }}
    />
    <LobbyStack.Screen
      name="SessionDetail"
      component={SessionDetailScreen}
      options={{ title: 'Salon', headerLeft: () => null, gestureEnabled: false }}
    />
  </LobbyStack.Navigator>
);

// Stack Navigator pour le Jeu (GameScreen + GameOverScreen)
const GameNavigator = () => (
  <GameStack.Navigator screenOptions={screenOptions}>
    <GameStack.Screen
      name="GameMain"
      component={GameScreen}
      options={{ headerShown: false }}
    />
    <GameStack.Screen
      name="GameOver"
      component={GameOverScreen}
      options={{ title: 'Fin de partie', headerLeft: () => null, gestureEnabled: false }}
    />
  </GameStack.Navigator>
);

// Stack Navigator pour le Profil (ProfileScreen + GameHistoryScreen)
const ProfileNavigator = () => (
  <ProfileStack.Navigator screenOptions={screenOptions}>
    <ProfileStack.Screen
      name="ProfileMain"
      component={ProfileScreen}
      options={{ headerShown: false }}
    />
    <ProfileStack.Screen
      name="GameHistory"
      component={GameHistoryScreen}
      options={{ title: 'Historique des parties' }}
    />
  </ProfileStack.Navigator>
);

export const AppTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: COLORS.surface,
        borderTopColor: COLORS.border,
      },
      tabBarActiveTintColor: COLORS.info,
      tabBarInactiveTintColor: COLORS.textSecondary,
    }}
  >
    <Tab.Screen
      name="Lobby"
      component={LobbyNavigator}
      options={{
        tabBarLabel: 'Lobby',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="people-outline" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Game"
      component={GameNavigator}
      options={{
        tabBarLabel: 'Jeu',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="game-controller-outline" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileNavigator}
      options={{
        tabBarLabel: 'Profil',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person-outline" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);
