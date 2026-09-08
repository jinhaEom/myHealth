import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { addDays, todayStr, weekStart } from '@/lib/date';
import { computeGoalProgress } from '@/lib/goal';
import { heatLevel } from '@/lib/heatmap';
import { useWorkoutStore } from '@/store/useWorkoutStore';

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

    return {
      insets,
      router,
      today,
      weekDays,
      weekLogs,
      weekMin,
      goalProgress,
    }
}
