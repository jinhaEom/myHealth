import type { WorkoutCycleStep } from '@/lib/types';
import { useAuthStore } from '@/store/useAuthStore';
import { useWorkoutStore } from '@/store/useWorkoutStore';
import * as Crypto from 'expo-crypto';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useSettings = () => {
  const insets = useSafeAreaInsets();
  const parts = useWorkoutStore((s) => s.parts);
  const addPart = useWorkoutStore((s) => s.addPart);
  const renamePart = useWorkoutStore((s) => s.renamePart);
  const setPartActive = useWorkoutStore((s) => s.setPartActive);
  const movePart = useWorkoutStore((s) => s.movePart);
  const setParts = useWorkoutStore((s) => s.setParts);
  const resetAll = useWorkoutStore((s) => s.resetAll);

  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const [duplicateAlertVisible, setDuplicateAlertVisible] = useState(false);
  const [invalidGoalAlertVisible, setInvalidGoalAlertVisible] = useState(false);
  const [resetConfirmVisible, setResetConfirmVisible] = useState(false);

  const logout = useAuthStore((s) => s.logout);

  const goal = useWorkoutStore((s) => s.goal);
  const setGoal = useWorkoutStore((s) => s.setGoal);
  const [goalCountInput, setGoalCountInput] = useState(String(goal?.targetCount ?? ''));
  const [goalRecurring, setGoalRecurring] = useState(goal?.recurring ?? true);

  useEffect(() => {
    if (!goal) return;
    setGoalCountInput(String(goal.targetCount));
    setGoalRecurring(goal.recurring);
  }, [goal]);

  const saveGoal = () => {
    const count = parseInt(goalCountInput, 10);
    if (!Number.isFinite(count) || count <= 0) return false;
    setGoal(count, goalRecurring);
    return true;
  };

  const cycle = useWorkoutStore((s) => s.cycle);
  const setCycle = useWorkoutStore((s) => s.setCycle);
  const [cycleSteps, setCycleStepsState] = useState<WorkoutCycleStep[]>(cycle?.steps ?? []);
  const [cycleDirty, setCycleDirty] = useState(false);
  const [invalidCycleAlertVisible, setInvalidCycleAlertVisible] = useState(false);

  useEffect(() => {
    if (cycleDirty) return;
    setCycleStepsState(cycle?.steps ?? []);
  }, [cycle, cycleDirty]);

  const addCycleStep = () => {
    setCycleStepsState((prev) => [...prev, { id: Crypto.randomUUID(), label: '', bodyPartIds: [] }]);
    setCycleDirty(true);
  };

  const removeCycleStep = (id: string) => {
    setCycleStepsState((prev) => prev.filter((s) => s.id !== id));
    setCycleDirty(true);
  };

  /** 칩으로 고른 부위 이름을 이어붙여 단계 이름을 만든다 (예: 가슴+삼두 선택 -> "가슴삼두") */
  const labelFromPartIds = (partIds: string[]) =>
    partIds
      .map((pid) => parts.find((p) => p.id === pid)?.name)
      .filter(Boolean)
      .join(' , ');

  const toggleCycleStepPart = (id: string, partId: string) => {
    setCycleStepsState((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const bodyPartIds = s.bodyPartIds.includes(partId)
          ? s.bodyPartIds.filter((p) => p !== partId)
          : [...s.bodyPartIds, partId];
        return { ...s, bodyPartIds, label: labelFromPartIds(bodyPartIds) };
      }),
    );
    setCycleDirty(true);
  };

  const moveCycleStep = (id: string, dir: -1 | 1) => {
    setCycleStepsState((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      const swapIdx = idx + dir;
      if (idx < 0 || swapIdx < 0 || swapIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return next;
    });
    setCycleDirty(true);
  };

  const saveCycle = () => {
    if (cycleSteps.some((s) => s.bodyPartIds.length === 0)) return false;
    setCycle(cycleSteps);
    setCycleDirty(false);
    return true;
  };

  return {
    insets,
    parts,
    addPart,
    renamePart,
    setPartActive,
    movePart,
    setParts,
    resetAll,
    newName,
    setNewName,
    editingId,
    setEditingId,
    editName,
    setEditName,
    logout,
    goal,
    goalCountInput,
    setGoalCountInput,
    goalRecurring,
    setGoalRecurring,
    saveGoal,
    duplicateAlertVisible,
    setDuplicateAlertVisible,
    invalidGoalAlertVisible,
    setInvalidGoalAlertVisible,
    resetConfirmVisible,
    setResetConfirmVisible,
    cycle,
    cycleSteps,
    addCycleStep,
    removeCycleStep,
    toggleCycleStepPart,
    moveCycleStep,
    saveCycle,
    invalidCycleAlertVisible,
    setInvalidCycleAlertVisible,
  };
};
