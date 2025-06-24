// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';

import { IconSymbol } from '../../components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Personagens',
          headerShown: true, // Mostra o header na lista principal
          tabBarIcon: ({ color, focused }) => (
            // CORREÇÃO: Usando nomes de ícones válidos para SF Symbols.
            <IconSymbol name={'list.bullet'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Favoritos',
          headerShown: true, // Mostra o header na lista de favoritos
          tabBarIcon: ({ color, focused }) => (
            // CORREÇÃO: Usando nomes de ícones válidos para SF Symbols.
            // 'heart.fill' para quando estiver focado, 'heart' para o contorno.
            <IconSymbol name={focused ? 'heart.fill' : 'heart'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}