import * as repo from '@/lib/repo';
import { pushAfterWrite } from '@/lib/sync';
import type { BodyPart, Goal, WorkoutCycle, WorkoutCycleStep, WorkoutLog } from '@/lib/types';
import { create } from 'zustand';

interface WorkoutState {
  hydrated: boolean;
  parts: BodyPart[];
  /** 부위 ID로 부위명을 찾는 사전 (삭제된 부위도 과거 기록 조회를 위해 포함) */
  partNamesById: Record<string, string>;
  logs: WorkoutLog[];
  goal: Goal | null;
  cycle: WorkoutCycle | null;
  loadAll: () => void;
  saveLog: (input: repo.UpsertLogInput) => void;
  removeLog: (logDate: string) => void;
  addPart: (name: string) => string | null;
  setPartActive: (id: string, active: boolean) => void;
  removePart: (id: string) => void;
  movePart: (id: string, dir: -1 | 1) => void;
  setParts: (parts: BodyPart[]) => void;
  setGoal: (targetCount: number, recurring: boolean) => void;
  setCycle: (steps: WorkoutCycleStep[]) => void;
  resetAll: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => {
  const refresh = () => {
    set({
      parts: repo.getBodyParts(),
      partNamesById: repo.getBodyPartNamesById(),
      logs: repo.getLogs(),
      goal: repo.getGoal(),
      cycle: repo.getCycle(),
    });
    pushAfterWrite();
  };
  return {
    hydrated: false,
    parts: [],
    partNamesById: {},
    logs: [],
    goal: null,
    cycle: null,
    loadAll: () => {
      try {
        set({
          parts: repo.getBodyParts(),
          partNamesById: repo.getBodyPartNamesById(),
          logs: repo.getLogs(),
          goal: repo.getGoal(),
          cycle: repo.getCycle(),
          hydrated: true,
        });
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
    setPartActive: (id, active) => {
      repo.setBodyPartActive(id, active);
      refresh();
    },
    removePart: (id) => {
      repo.deleteBodyPart(id);
      refresh();
    },
    movePart: (id, dir) => {
      repo.moveBodyPart(id, dir);
      refresh();
    },
    setParts: (parts) => set({ parts }),
    setGoal: (targetCount, recurring) => {
      repo.setGoal(targetCount, recurring);
      refresh();
    },
    setCycle: (steps) => {
      repo.setCycleSteps(steps);
      refresh();
    },
    resetAll: () => {
      repo.resetAllData();
      set({
        parts: repo.getBodyParts(),
        partNamesById: repo.getBodyPartNamesById(),
        logs: repo.getLogs(),
        goal: repo.getGoal(),
        cycle: repo.getCycle(),
      });
    },
  };
});
