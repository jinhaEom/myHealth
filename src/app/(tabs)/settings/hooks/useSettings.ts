import { useAuthStore } from '@/store/useAuthStore';
import { useWorkoutStore } from '@/store/useWorkoutStore';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useSettings = () => {
  const insets = useSafeAreaInsets();
  const parts = useWorkoutStore((s) => s.parts);
  const addPart = useWorkoutStore((s) => s.addPart);
  const renamePart = useWorkoutStore((s) => s.renamePart);
  const setPartActive = useWorkoutStore((s) => s.setPartActive);
  const movePart = useWorkoutStore((s) => s.movePart);
  const resetAll = useWorkoutStore((s) => s.resetAll);

  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const logout = useAuthStore((s) => s.logout);

  return {
    insets,
    parts,
    addPart,
    renamePart,
    setPartActive,
    movePart,
    resetAll,
    newName,
    setNewName,
    editingId,
    setEditingId,
    editName,
    setEditName,
    logout
  };
};