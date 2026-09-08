/** 부위 칩  */
export interface BodyPart {
  id: string;
  name: string;
  sortOrder: number;
  /** false여도 과거 기록의 부위는 유지된다 (비활성화 = 삭제 대용) */
  isActive: boolean;
}

/** 하루 기록 — 날짜당 1건 */
export interface WorkoutLog {
  id: string;
  /** YYYY-MM-DD (로컬 기준) */
  logDate: string;
  durationMin: number;
  /** 1~5, 평소 대비 강도 */
  intensity: number;
  /** 1~5, 몸 상태 */
  condition: number;
  memo: string | null;
  partIds: string[];
}

/** 주간 운동 횟수 목표 */
export interface Goal {
  targetCount: number;
  /** true면 매주 자동 적용, false면 weekStart가 속한 주에만 유효 */
  recurring: boolean;
  /** 이 설정이 적용되기 시작한 주의 월요일 (YYYY-MM-DD) */
  weekStart: string;
}

export interface GoalProgress {
  targetCount: number;
  achievedCount: number;
  percent: number;
  recurring: boolean;
}
