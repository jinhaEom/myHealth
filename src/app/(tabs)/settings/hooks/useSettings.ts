import { useAuthStore } from '@/store/useAuthStore';
import { useWorkoutStore } from '@/store/useWorkoutStore';
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
  };
};
