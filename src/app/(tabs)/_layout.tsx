import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Platform } from 'react-native';
import { Colors } from '@/constants/colors';

export default function TabsLayout() {
  // Android는 기본 JS 탭바를 다크로 커스텀, iOS는 네이티브 탭바(리퀴드 글래스) 유지
  return Platform.OS === 'android' ? <AndroidTabs /> : <IosTabs />;
}

// ── iOS: 네이티브 탭바 (iOS26 리퀴드 글래스 자동) ──
function IosTabs() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Label>홈</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="calendar">
        <NativeTabs.Trigger.Label>캘린더</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="calendar" md="calendar_month" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>설정</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="gearshape.fill" md="settings" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}


// ── Android: 기본 탭바를 이미지처럼 다크로 커스텀 ──
function AndroidTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // 각 화면의 Stack이 자체 헤더를 그리므로 탭 헤더는 끔
        tabBarActiveTintColor: Colors.text,
        tabBarInactiveTintColor: Colors.dim,
        tabBarStyle: {
          backgroundColor: Colors.bg,
          borderTopColor: Colors.line,
        },
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: '홈',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: '캘린더',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '설정',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
