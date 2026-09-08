import type { Goal, GoalProgress } from './types';

/**
 * 목표 진행률 계산. 별도 저장 x
 */
export function computeGoalProgress(
  goal: Goal | null,
  currentWeekStart: string,
  achievedCount: number,
): GoalProgress | null {
  if (!goal) return null;
  if (!goal.recurring && goal.weekStart !== currentWeekStart) return null;
  const percent = Math.min(100, Math.round((achievedCount / goal.targetCount) * 100));
  return { targetCount: goal.targetCount, achievedCount, percent, recurring: goal.recurring };
}
