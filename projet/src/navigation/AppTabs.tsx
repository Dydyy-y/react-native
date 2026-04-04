import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AppTabsParamList } from './NavigationTypes';
import { ProfileScreen } from '../features/auth/screens/ProfileScreen';
import { COLORS } from '../shared/utils/constants';

const Tab = createBottomTabNavigator<AppTabsParamList>();

// Placeholders pour les épics futurs
const LobbyPlaceholder = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>Lobby</Text>
    <Text style={styles.placeholderSubtext}>Épic 2 — À venir</Text>
  </View>
);

const GamePlaceholder = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>Jeu</Text>
    <Text style={styles.placeholderSubtext}>Épic 4 — À venir</Text>
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
      component={LobbyPlaceholder}
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
