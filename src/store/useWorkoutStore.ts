import { create } from 'zustand';
import * as repo from '@/lib/repo';
import type { BodyPart, WorkoutLog } from '@/lib/types';
// import { pushUnsynced } from '@/lib/sync'; // 3단계: 쓰기 직후 서버 반영 (§10)

interface WorkoutState {
  hydrated: boolean;
  /** 활성+비활성 전체, sortOrder 순 */
  parts: BodyPart[];
  /** 삭제 제외, 날짜 오름차순 */
  logs: WorkoutLog[];
  loadAll: () => void;
  saveLog: (input: repo.UpsertLogInput) => void;
  removeLog: (logDate: string) => void;
  /** 추가된 부위 id, 중복이면 null */
  addPart: (name: string) => string | null;
  renamePart: (id: string, name: string) => boolean;
  setPartActive: (id: string, active: boolean) => void;
  movePart: (id: string, dir: -1 | 1) => void;
  resetAll: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => {
  const refresh = () => set({ parts: repo.getBodyParts(), logs: repo.getLogs() });
  return {
    hydrated: false,
    parts: [],
    logs: [],
    loadAll: () => {
      try {
        set({ parts: repo.getBodyParts(), logs: repo.getLogs(), hydrated: true });
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
    resetAll: () => {
      repo.resetAllData();
      refresh();
    },
  };
});
