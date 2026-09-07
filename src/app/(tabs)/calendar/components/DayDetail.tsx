import { Chip } from '@/components/Chip';
import { CONDITION_EMOJI, INTENSITY_LABELS } from '@/constants/recovery';
import { formatDuration, formatKorean, todayStr } from '@/lib/date';
import type { WorkoutLog } from '@/lib/types';
import { useWorkoutStore } from '@/store/useWorkoutStore';
import { useRouter } from 'expo-router';
import { Alert, Pressable, Text, View } from 'react-native';

/** 날짜 탭 시 상세  */


export default function DayDetail({ date, log }: { date: string; log: WorkoutLog | undefined }) {
  const router = useRouter();
  const today = todayStr();
  const parts = useWorkoutStore((s) => s.parts);
  const removeLog = useWorkoutStore((s) => s.removeLog);

  const goRecord = () => router.push({ pathname: '/record', params: { date } });

  const onDelete = () => {
    Alert.alert('기록 삭제', `${formatKorean(date)} 기록을 삭제할까요?`, [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: () => removeLog(date) },
    ]);
  };

  return (
    <View className="mt-[16px] rounded-[16px] bg-card p-[16px]">
      <Text className="text-[15px] font-medium text-fg">{formatKorean(date)}</Text>
      {!log ? (
        date > today ? (
          <Text className="mt-[8px] text-[13px] text-sub">미래 날짜예요</Text>
        ) : (
          <Pressable
            className="mt-[12px] items-center rounded-[14px] border border-line py-[12px]"
            onPress={goRecord}
          >
            <Text className="text-[15px] font-medium text-fg">이 날짜에 기록하기</Text>
          </Pressable>
        )
      ) : (
        <>
          <View className="mt-[10px] flex-row flex-wrap gap-[6px]">
            {log.partIds.map((id) => {
              const part = parts.find((p) => p.id === id);
              return part ? <Chip key={id} label={part.name} small /> : null;
            })}
          </View>
          <Text className="mt-[10px] text-[14px] text-fg">
            {formatDuration(log.durationMin)} · 강도 {log.intensity} (
            {INTENSITY_LABELS[log.intensity - 1]}) · 컨디션 {CONDITION_EMOJI[log.condition - 1]}
          </Text>
          {log.memo ? <Text className="mt-[6px] text-[13px] text-sub">{log.memo}</Text> : null}
          <View className="mt-[14px] flex-row gap-[20px]">
            <Pressable onPress={goRecord} hitSlop={8}>
              <Text className="text-[14px] font-medium text-fg">수정</Text>
            </Pressable>
            <Pressable onPress={onDelete} hitSlop={8}>
              <Text className="text-[14px] text-danger">삭제</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}