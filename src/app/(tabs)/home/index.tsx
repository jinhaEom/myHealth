import { WeekGrass } from '@/components/WeekGrass';
import { BottomTabInset } from '@/constants/constant';
import { formatDuration, formatKorean } from '@/lib/date';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useHome } from './hooks/useHome';

export default function HomeScreen() {
  const { insets, router, today, weekDays, weekLogs, weekMin } = useHome();

  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top }}>
      <ScrollView contentContainerClassName="px-[16px] pb-[24px]" showsVerticalScrollIndicator={false}>
        <Text className="mt-[8px] text-[13px] text-sub">{formatKorean(today)}</Text>
        <Text className="mt-[2px] text-[26px] font-medium text-fg">오늘</Text>

        {/* TODO */}
        <Text className="mt-[2px] text-[13px] text-sub">TODO 이번주 목표 설정 및 달성 퍼센트</Text>
        {/* 이번 주 */}
        <Text className="mb-[8px] mt-[24px] text-[13px] text-sub">이번 주</Text>
        <View className="rounded-[16px] bg-card p-[16px]">
          <WeekGrass days={weekDays} />
          <Text className="mt-[12px] text-[13px] text-sub">
            {weekLogs.length > 0
              ? `${weekLogs.length}회 · 총 ${formatDuration(weekMin)}`
              : '아직 기록이 없어요'}
          </Text>
        </View>
      </ScrollView>
      <View
        className="px-[16px] pt-[8px]"
        style={{ paddingBottom: Platform.OS === 'ios' ? insets.bottom + BottomTabInset : 16 }}
      >
        <Pressable
          className="items-center rounded-[14px] bg-accent py-[15px]"
          onPress={() => router.push('/record')}
        >
          <Text className="text-[16px] font-medium text-on-accent">운동 기록하기</Text>
        </Pressable>
      </View>
    </View>
  );
}
