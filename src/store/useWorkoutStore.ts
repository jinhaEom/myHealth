import { create } from 'zustand';
import * as repo from '@/lib/repo';
import { pushAfterWrite } from '@/lib/sync';
import type { BodyPart, Goal, WorkoutLog } from '@/lib/types';

interface WorkoutState {
  hydrated: boolean;
  parts: BodyPart[];
  logs: WorkoutLog[];
  goal: Goal | null;
  loadAll: () => void;
  saveLog: (input: repo.UpsertLogInput) => void;
  removeLog: (logDate: string) => void;
  addPart: (name: string) => string | null;
  renamePart: (id: string, name: string) => boolean;
  setPartActive: (id: string, active: boolean) => void;
  movePart: (id: string, dir: -1 | 1) => void;
  setGoal: (targetCount: number, recurring: boolean) => void;
  resetAll: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => {
  const refresh = () => {
    set({ parts: repo.getBodyParts(), logs: repo.getLogs(), goal: repo.getGoal() });
    pushAfterWrite();
  };
  return {
    hydrated: false,
    parts: [],
    logs: [],
    goal: null,
    loadAll: () => {
      try {
        set({ parts: repo.getBodyParts(), logs: repo.getLogs(), goal: repo.getGoal(), hydrated: true });
      } catch (e) {
        console.warn('로컬 DB 초기화 실패', e);
      }
    },
    saveLog: (input) => {
      repo.upsertLog(input);
      refresh();
    },
    removeLog: (logDate) => {
      repo.softDeleteLog(logDate);
      refresh();
    },
    addPart: (name) => {
      const id = repo.addBodyPart(name.trim());
      if (id) refresh();
      return id;
    },
    renamePart: (id, name) => {
      const ok = repo.renameBodyPart(id, name.trim());
      if (ok) refresh();
      return ok;
    },
    setPartActive: (id, active) => {
      repo.setBodyPartActive(id, active);
      refresh();
    },
    movePart: (id, dir) => {
      repo.moveBodyPart(id, dir);
      refresh();
    },
    setGoal: (targetCount, recurring) => {
      repo.setGoal(targetCount, recurring);
      refresh();
    },
    resetAll: () => {
      repo.resetAllData();
      set({ parts: repo.getBodyParts(), logs: repo.getLogs(), goal: repo.getGoal() });
    },
  };
});
