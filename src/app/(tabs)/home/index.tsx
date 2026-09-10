import { WeekGrass } from '@/components/WeekGrass';
import { Colors } from '@/constants/colors';
import { BottomTabInset } from '@/constants/constant';
import { formatDuration, formatKorean } from '@/lib/date';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { CycleModal } from './detail/CycleModal';
import { GoalModal } from './detail/GoalModal';
import { useHome } from './hooks/useHome';

export default function HomeScreen() {
  const {
    insets,
    router,
    today,
    weekDays,
    weekLogs,
    weekMin,
    goalProgress,
    consecutiveDays,
    quoteOfDay,
    currentCycleStep,
    nextCycleStep,
    isCycleModalOpen,
    setIsCycleModalOpen,
    isGoalModalOpen,
    setIsGoalModalOpen,
  } = useHome();

  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top }}>
      <ScrollView contentContainerClassName="px-[16px] pb-[24px]" showsVerticalScrollIndicator={false}>
        <Text className="mt-[8px] text-[13px] text-sub">{formatKorean(today)}</Text>
        <Text className="mt-[2px] text-[26px] font-medium text-fg">오늘</Text>
        {quoteOfDay && (
          <>
            <Text className="mt-[20px] text-[13px] italic leading-6 text-sub">
              “{quoteOfDay.quote}”
            </Text>
            <Text className="mt-[2px] text-[13px] italic leading-6 text-sub">
              - {quoteOfDay.author}
            </Text>
          </>
        )}
        <View className="flex-row justify-between w-full gap-[12px]">
          <View className="mt-[24px] rounded-[16px] bg-card p-[16px] w-1/3">
            <Text className="text-[13px] text-sub">
              연속 기록일수
            </Text>
            <Text className="mt-[2px] text-[26px] font-semibold text-fg">🔥 {consecutiveDays}일</Text>
          </View>
          {/* 운동 싸이클 */}
          {currentCycleStep ? (
            <View className="mt-[24px] rounded-[16px] bg-card p-[16px] flex-1">
              <View className="flex-row justify-between">
                <Text className="text-[13px] text-sub">오늘 할 운동</Text>
                <TouchableOpacity onPress={() => setIsCycleModalOpen(true)}>
                  <Ionicons name="pencil" size={16} color={Colors.disabledColor} />
                </TouchableOpacity>
              </View>
              <Text className="mt-[6px] text-[28px] font-semibold text-fg">{currentCycleStep.label}</Text>
              {nextCycleStep && (
                <Text className="mt-[6px] text-[12px] text-dim">다음 차례: {nextCycleStep.label}</Text>
              )}
            </View>
          ) : (
            <Pressable
              className="mt-[24px] flex-row items-center justify-between rounded-[16px] bg-card p-[16px]"
              onPress={() => setIsCycleModalOpen(true)}
            >
              <Text className="text-[13px] text-sub">운동 싸이클을 등록해보세요</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.disabledColor} />
            </Pressable>
          )}
        </View>

        {/* 주간 목표 */}
        {goalProgress ? (
          <View className="mt-[24px] rounded-[16px] bg-card p-[16px]">
            <View className="flex-row justify-between">
              <Text className="text-[13px] text-sub">
                주간 목표{goalProgress.recurring ? ' · 매주 반복' : ''}
              </Text>
              <TouchableOpacity onPress={() => setIsGoalModalOpen(true)}>
                <Ionicons name="pencil" size={16} color={Colors.disabledColor} />
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center justify-between">

              <Text className="text-[13px] text-sub">
                {goalProgress.achievedCount}/{goalProgress.targetCount}회
              </Text>
            </View>
            <Text className="mt-[6px] text-[28px] font-semibold text-fg">{goalProgress.percent}%</Text>
            <View className="mt-[10px] h-[6px] overflow-hidden rounded-full bg-line">
              <View className="h-full rounded-full bg-accent" style={{ width: `${goalProgress.percent}%` }} />
            </View>

          </View>
        ) : (
          <Pressable
            className="mt-[24px] flex-row items-center justify-between rounded-[16px] bg-card p-[16px]"
            onPress={() => setIsCycleModalOpen(true)}
          >
            <Text className="text-[13px] text-sub">주간 목표를 설정해보세요</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.disabledColor} />
          </Pressable>
        )}



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
      <CycleModal
        visible={isCycleModalOpen}
        onClose={() => setIsCycleModalOpen(false)}
      />
      <GoalModal
        visible={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
      />
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
