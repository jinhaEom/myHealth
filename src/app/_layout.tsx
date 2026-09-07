// NativeWind 스타일 로드 — 앱 전체에서 딱 한 번, 진입점에서 import 한다
import '@/global.css';

import { Colors } from '@/constants/colors';
import { useWorkoutStore } from '@/store/useWorkoutStore';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

export default function RootLayout() {
  const loadAll = useWorkoutStore((s) => s.loadAll);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.bg },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="record" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}
