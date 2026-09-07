import { SCROLL_BOTTOM, WEEKDAY } from '@/constants/constant';
import { Colors } from '@/constants/colors';
import { monthMatrix, todayStr } from '@/lib/date';
import { useWorkoutStore } from '@/store/useWorkoutStore';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import DayDetail from './DayDetail';

/* ── 월간 캘린더 ── */

export default function MonthView() {
  const today = todayStr();
  const logs = useWorkoutStore((s) => s.logs);
  // 훅은 컴포넌트 최상위에서만 — map 콜백 안에서 호출하면 안 된다
  const parts = useWorkoutStore((s) => s.parts);
  const [year, setYear] = useState(Number(today.slice(0, 4)));
  const [month, setMonth] = useState(Number(today.slice(5, 7)));
  const [selected, setSelected] = useState(today);

  const logsByDate = useMemo(() => new Map(logs.map((l) => [l.logDate, l])), [logs]);
  const partNameById = useMemo(() => new Map(parts.map((p) => [p.id, p.name])), [parts]);
  const weeks = useMemo(() => monthMatrix(year, month), [year, month]);

  const moveMonth = (dir: -1 | 1) => {
    const d = new Date(year, month - 1 + dir, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth() + 1);
  };

  return (
    <ScrollView
      contentContainerClassName={`px-[16px] ${SCROLL_BOTTOM}`}
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-[10px] mt-[18px] flex-row items-center justify-between px-[4px]">
        <Pressable onPress={() => moveMonth(-1)} hitSlop={10}>
          <Ionicons name="chevron-back" size={20} color={Colors.sub} />
        </Pressable>
        <Text className="text-[17px] font-medium text-fg">
          {year}년 {month}월
        </Text>
        <Pressable onPress={() => moveMonth(1)} hitSlop={10}>
          <Ionicons name="chevron-forward" size={20} color={Colors.sub} />
        </Pressable>
      </View>

      <View className="mb-[4px] flex-row">
        {WEEKDAY.map((w) => (
          <Text key={w} className="flex-1 text-center text-[12px] text-sub">
            {w}
          </Text>
        ))}
      </View>

      {weeks.map((week, wi) => (
        <View key={wi} className="flex-row">
          {week.map((date, di) => {
            if (!date) return <View key={di} className="flex-1 py-[3px]" />;
            const log = logsByDate.get(date);
            const isSelected = date === selected;
            const isToday = date === today;
            // 그날 기록에 연결된 부위 이름들 (log.partIds → 이름)
            const partNames =
              log?.partIds.map((id) => partNameById.get(id)).filter((n) => n !== undefined) ?? [];

            return (
              <Pressable
                key={di}
                className="flex-1 items-center py-[3px]"
                onPress={() => setSelected(date)}
              >
                <View
                  className={`h-[46px] w-[40px] items-center justify-center gap-[4px] rounded-[10px] ${isSelected ? 'bg-card-sel' : ''
                    }`}
                >
                  <Text className={`text-[15px] text-fg ${isToday ? 'font-bold' : ''}`}>
                    {Number(date.slice(8, 10))}
                  </Text>
                  <Text
                    className="h-[12px] text-[10px] leading-[12px] text-sub"
                    numberOfLines={1}
                  >
                    {partNames.length > 0
                      ? `${partNames[0]}${partNames.length > 1 ? ` +${partNames.length - 1}` : ''}`
                      : ''}
                  </Text>

                  {/* 기록 점 — 없는 날도 자리는 유지해 날짜 정렬 고정 */}
                  <View className="h-[6px] w-[6px]">
                    {log && (
                      <Image
                        source={require('@/assets/images/ic_lime_dot.png')}
                        style={{ width: 6, height: 6 }}
                      />
                    )}
                  </View>

                </View>
              </Pressable>
            );
          })}
        </View>
      ))}

      <DayDetail date={selected} log={logsByDate.get(selected)} />
    </ScrollView>
  );
}