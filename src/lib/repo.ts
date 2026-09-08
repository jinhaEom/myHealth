import * as Crypto from 'expo-crypto';
import { todayStr, weekStart } from './date';
import { getDb, seedDefaultPartsIfEmpty, wipeLocalData } from './db';
import type { BodyPart, Goal, WorkoutLog } from './types';

/**
 * 로컬 DB CRUD.
 */

const nowIso = () => new Date().toISOString();

interface BodyPartRow {
  id: string;
  name: string;
  sort_order: number;
  is_active: number;
}

export function getBodyParts(): BodyPart[] {
  return getDb()
    .getAllSync<BodyPartRow>('SELECT id, name, sort_order, is_active FROM body_parts ORDER BY sort_order, name')
    .map((r) => ({ id: r.id, name: r.name, sortOrder: r.sort_order, isActive: r.is_active === 1 }));
}

interface LogRow {
  id: string;
  log_date: string;
  duration_min: number;
  intensity: number;
  condition: number;
  memo: string | null;
}

/** 삭제되지 않은 기록 전체, 날짜 오름차순 */
export function getLogs(): WorkoutLog[] {
  const db = getDb();
  const rows = db.getAllSync<LogRow>(
    'SELECT id, log_date, duration_min, intensity, condition, memo FROM workout_logs WHERE deleted_at IS NULL ORDER BY log_date',
  );
  const partRows = db.getAllSync<{ log_id: string; body_part_id: string }>(
    'SELECT log_id, body_part_id FROM workout_log_parts',
  );
  const partsByLog = new Map<string, string[]>();
  for (const p of partRows) {
    const list = partsByLog.get(p.log_id) ?? [];
    list.push(p.body_part_id);
    partsByLog.set(p.log_id, list);
  }
  return rows.map((r) => ({
    id: r.id,
    logDate: r.log_date,
    durationMin: r.duration_min,
    intensity: r.intensity,
    condition: r.condition,
    memo: r.memo,
    partIds: partsByLog.get(r.id) ?? [],
  }));
}

export interface UpsertLogInput {
  logDate: string;
  durationMin: number;
  intensity: number;
  condition: number;
  memo: string | null;
  partIds: string[];
}

export function upsertLog(input: UpsertLogInput) {
  const db = getDb();
  const now = nowIso();
  db.withTransactionSync(() => {
    const existing = db.getFirstSync<{ id: string }>(
      'SELECT id FROM workout_logs WHERE log_date = ?', input.logDate,
    );
    const id = existing?.id ?? Crypto.randomUUID();
    if (existing) {
      db.runSync(
        `UPDATE workout_logs
           SET duration_min = ?, intensity = ?, condition = ?, memo = ?,
               updated_at = ?, deleted_at = NULL, synced = 0
         WHERE id = ?`,
        input.durationMin, input.intensity, input.condition, input.memo, now, id,
      );
    } else {
      db.runSync(
        `INSERT INTO workout_logs (id, log_date, duration_min, intensity, condition, memo, updated_at, synced)
         VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
        id, input.logDate, input.durationMin, input.intensity, input.condition, input.memo, now,
      );
    }
    db.runSync('DELETE FROM workout_log_parts WHERE log_id = ?', id);
    for (const partId of input.partIds) {
      db.runSync('INSERT INTO workout_log_parts (log_id, body_part_id) VALUES (?, ?)', id, partId);
    }
  });
}

/** 소프트 삭제 — 동기화 시 삭제도 전파 */
export function softDeleteLog(logDate: string) {
  const now = nowIso();
  getDb().runSync(
    'UPDATE workout_logs SET deleted_at = ?, updated_at = ?, synced = 0 WHERE log_date = ?',
    now, now, logDate,
  );
}

/** 추가 성공 시 새 부위의 id 반환, 중복 이름이면 null. 비활성 동명 칩은 되살림 */
export function addBodyPart(name: string): string | null {
  const db = getDb();
  const dup = db.getFirstSync<{ id: string; is_active: number }>(
    'SELECT id, is_active FROM body_parts WHERE name = ?', name,
  );
  if (dup) {
    if (dup.is_active === 1) return null;
    db.runSync('UPDATE body_parts SET is_active = 1, updated_at = ?, synced = 0 WHERE id = ?', nowIso(), dup.id);
    return dup.id;
  }
  const max = db.getFirstSync<{ m: number | null }>('SELECT MAX(sort_order) AS m FROM body_parts');
  const id = Crypto.randomUUID();
  db.runSync(
    'INSERT INTO body_parts (id, name, sort_order, is_active, updated_at, synced) VALUES (?, ?, ?, 1, ?, 0)',
    id, name, (max?.m ?? -1) + 1, nowIso(),
  );
  return id;
}

/** 이름 변경. 다른 칩과 중복이면 false */
export function renameBodyPart(id: string, name: string): boolean {
  const db = getDb();
  const dup = db.getFirstSync<{ id: string }>('SELECT id FROM body_parts WHERE name = ? AND id != ?', name, id);
  if (dup) return false;
  db.runSync('UPDATE body_parts SET name = ?, updated_at = ?, synced = 0 WHERE id = ?', name, nowIso(), id);
  return true;
}

export function setBodyPartActive(id: string, active: boolean) {
  getDb().runSync(
    'UPDATE body_parts SET is_active = ?, updated_at = ?, synced = 0 WHERE id = ?',
    active ? 1 : 0, nowIso(), id,
  );
}

/** 정렬 순서 한 칸 이동 (dir: -1 위 / +1 아래) */
export function moveBodyPart(id: string, dir: -1 | 1) {
  const parts = getBodyParts();
  const idx = parts.findIndex((p) => p.id === id);
  const other = parts[idx + dir];
  if (idx < 0 || !other) return;
  const reordered = [...parts];
  reordered[idx] = other;
  reordered[idx + dir] = parts[idx];
  const db = getDb();
  const now = nowIso();
  db.withTransactionSync(() => {
    // 현재 표시 순서 기준으로 전체 재번호
    reordered.forEach((p, i) => {
      db.runSync('UPDATE body_parts SET sort_order = ?, updated_at = ?, synced = 0 WHERE id = ?', i, now, p.id);
    });
  });
}

interface GoalRow { target_count: number; recurring: number; week_start: string }

export function getGoal(): Goal | null {
  const row = getDb().getFirstSync<GoalRow>(
    'SELECT target_count, recurring, week_start FROM goals WHERE id = 1',
  );
  if (!row) return null;
  return { targetCount: row.target_count, recurring: row.recurring === 1, weekStart: row.week_start };
}

/** 목표 설정/수정 — 매번 이번 주를 기준 주로 다시 잡음 */
export function setGoal(targetCount: number, recurring: boolean) {
  getDb().runSync(
    `INSERT INTO goals (id, target_count, recurring, week_start, updated_at)
     VALUES (1, ?, ?, ?, ?)
     ON CONFLICT (id) DO UPDATE SET
       target_count = excluded.target_count, recurring = excluded.recurring,
       week_start = excluded.week_start, updated_at = excluded.updated_at`,
    targetCount, recurring ? 1 : 0, weekStart(todayStr()), nowIso(),
  );
}

/** 데이터 초기화 — 전부 지우고 기본 부위 재삽입 */
export function resetAllData() {
  const db = getDb();
  wipeLocalData(db);
  seedDefaultPartsIfEmpty(db);
}
