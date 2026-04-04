import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { AppTabsParamList, LobbyStackParamList } from './NavigationTypes';
import { ProfileScreen } from '../features/auth/screens/ProfileScreen';
import {
  LobbyHomeScreen,
  CreateSessionScreen,
  JoinSessionScreen,
  SessionDetailScreen,
} from '../features/lobby';
import { GameScreen } from '../features/game';
import { COLORS } from '../shared/utils/constants';

const Tab = createBottomTabNavigator<AppTabsParamList>();
const LobbyStack = createStackNavigator<LobbyStackParamList>();

// Stack Navigator pour le Lobby (4 écrans)
const LobbyNavigator = () => (
  <LobbyStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.surface },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: 'bold' },
      cardStyle: { backgroundColor: COLORS.background },
    }}
  >
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
      options={{ title: 'Salon', headerLeft: () => null }}
    />
  </LobbyStack.Navigator>
);

// Game Navigator (Sprint 4)
const GameNavigator = () => <GameScreen />;

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
      component={ProfileScreen}
      options={{
        tabBarLabel: 'Profil',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person-outline" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

