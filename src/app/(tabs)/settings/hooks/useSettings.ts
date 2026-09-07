import { useAuthStore } from '@/store/useAuthStore';
import { useWorkoutStore } from '@/store/useWorkoutStore';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useSettings = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const parts = useWorkoutStore((s) => s.parts);
  const addPart = useWorkoutStore((s) => s.addPart);
  const renamePart = useWorkoutStore((s) => s.renamePart);
  const setPartActive = useWorkoutStore((s) => s.setPartActive);
  const movePart = useWorkoutStore((s) => s.movePart);
  const resetAll = useWorkoutStore((s) => s.resetAll);
  const signOut = useAuthStore((s) => s.logout);

  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const logout = async () => {
    try {
      await signOut();
    } catch (e) {
      Alert.alert('로그아웃 실패', e instanceof Error ? e.message : '잠시 후 다시 시도해 주세요');
      return;
    }
    router.replace('/login');
  };

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
    logout,
  };
};
