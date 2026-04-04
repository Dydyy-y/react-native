import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

// Placeholder pour le jeu (Sprint 4)
const GamePlaceholder = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>Jeu</Text>
    <Text style={styles.placeholderSubtext}>Epic 4 — A venir</Text>
  </View>
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
      component={GamePlaceholder}
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

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  placeholderSubtext: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});
