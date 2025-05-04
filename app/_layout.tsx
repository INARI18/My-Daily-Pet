import React from 'react';
import { View } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Slot } from 'expo-router';

import "../styles/global.css";

export default function Layout() {
  const colorScheme = useColorScheme();

  return (
    <View style={{ flex: 1, backgroundColor: Colors[colorScheme ?? 'light'].background }}>
      <Slot />
    </View>
  );
}
