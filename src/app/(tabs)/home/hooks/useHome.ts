import { quotes } from '@/constants/quotes';
import { addDays, todayStr, weekStart } from '@/lib/date';
import { computeGoalProgress } from '@/lib/goal';
import { heatLevel } from '@/lib/heatmap';
import { useWorkoutStore } from '@/store/useWorkoutStore';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useHome = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const logs = useWorkoutStore((s) => s.logs);
  const goal = useWorkoutStore((s) => s.goal);

  const today = todayStr();
  const logsByDate = useMemo(() => new Map(logs.map((l) => [l.logDate, l])), [logs]);
  const ws = weekStart(today);
  const weekDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const date = addDays(ws, i);
        return { date, level: heatLevel(logsByDate.get(date)), isToday: date === today };
      }),
    [ws, logsByDate, today],
  );
  const weekLogs = logs.filter((l) => l.logDate >= ws && l.logDate < addDays(ws, 7));
  const weekMin = weekLogs.reduce((sum, l) => sum + l.durationMin, 0);
  const goalProgress = useMemo(
    () => computeGoalProgress(goal, ws, weekLogs.length),
    [goal, ws, weekLogs.length],
  );

  //연속 기록 일수 (오늘 기록 전이어도 어제까지의 운동일자는 유지)
  const consecutiveDays = useMemo(() => {
    let count = 0;
    let date = logsByDate.has(today) ? today : addDays(today, -1);
    while (logsByDate.has(date)) {
      count++;
      date = addDays(date, -1);
    }
    return count;
  }, [logsByDate, today]);

  // 오늘의 한마디 
  const quoteOfDay = useMemo(() => {
    if (quotes.length === 0) return null;
    const seed = Number(today.replace(/-/g, ''));
    return quotes[seed % quotes.length];
  }, [today]);

  return {
    insets,
    router,
    today,
    weekDays,
    weekLogs,
    weekMin,
    goalProgress,
    consecutiveDays,
    quoteOfDay,
  }
}
