import { DEFAULT_BODY_PARTS } from '@/constants/recovery';
import * as Crypto from 'expo-crypto';
import { openDatabaseSync, type SQLiteDatabase } from 'expo-sqlite';

/**
 * 로컬 SQLite
 */

let db: SQLiteDatabase | null = null;

export function getDb(): SQLiteDatabase {
  if (db) return db;
  db = openDatabaseSync('myhealth.db');
  migrate(db);
  seedDefaultPartsIfEmpty(db);
  return db;
}

function migrate(db: SQLiteDatabase) {
  db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS body_parts (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL UNIQUE,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      updated_at TEXT NOT NULL,
      synced INTEGER NOT NULL DEFAULT 0
    );

    -- 서버는 UNIQUE(user_id, log_date), 로컬은 단일 사용자라 log_date만 UNIQUE.
    -- 소프트 삭제(deleted_at) 행도 UNIQUE에 걸리므로 upsert 시 기존 행을 재사용한다.
    CREATE TABLE IF NOT EXISTS workout_logs (
      id TEXT PRIMARY KEY NOT NULL,
      log_date TEXT NOT NULL UNIQUE,
      duration_min INTEGER NOT NULL,
      intensity INTEGER NOT NULL,
      condition INTEGER NOT NULL,
      memo TEXT,
      updated_at TEXT NOT NULL,
      deleted_at TEXT,
      synced INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS workout_log_parts (
      log_id TEXT NOT NULL,
      body_part_id TEXT NOT NULL,
      PRIMARY KEY (log_id, body_part_id)
    );
  `);
}

/** 최초 실행 시 기본 부위 7개 */
export function seedDefaultPartsIfEmpty(db: SQLiteDatabase) {
  const row = db.getFirstSync<{ n: number }>('SELECT COUNT(*) AS n FROM body_parts');
  if ((row?.n ?? 0) > 0) return;
  const now = new Date().toISOString();
  db.withTransactionSync(() => {
    DEFAULT_BODY_PARTS.forEach((name, i) => {
      db.runSync(
        'INSERT INTO body_parts (id, name, sort_order, is_active, updated_at, synced) VALUES (?, ?, ?, 1, ?, 0)',
        Crypto.randomUUID(), name, i, now,
      );
    });
  });
}
