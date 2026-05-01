-- ============================================================================
-- Migration: 创建 document_shares 表（文档分享 + 基础权限管理）
-- Date     : 2026-04-28
-- Author   : Entelechia
--
-- 用途：为已有 documents 表附加「分享 + 基础权限（view / edit）」能力。
--
-- 设计要点：
--   1. 不修改任何已有表的字段，新增 1 张表。
--   2. 每个文档对每种 permission（view / edit）最多只能存在 1 条 is_active=true
--      的分享记录，由部分唯一索引 idx_active_share_per_perm 保证。
--   3. 撤销采用软删除 (is_active=false)，便于审计 + 重新生成时的历史保留。
--   4. share_code 由后端生成，长度 12 位 base64url 字符（VARCHAR(16) 留余量）。
--   5. ON DELETE CASCADE：原文档被删时，对应分享记录自动清理。
--
-- 执行方式（任选其一）：
--   psql -U <user> -d <db> -f server/migrations/2026_04_28_create_document_shares.sql
--   或在 psql 交互界面：\i server/migrations/2026_04_28_create_document_shares.sql
-- ============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS document_shares (
  id           SERIAL       PRIMARY KEY,
  document_id  INTEGER      NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  share_code   VARCHAR(16)  NOT NULL UNIQUE,
  permission   VARCHAR(8)   NOT NULL CHECK (permission IN ('view','edit')),
  is_active    BOOLEAN      NOT NULL DEFAULT true,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  revoked_at   TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_active_share_per_perm
  ON document_shares (document_id, permission)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_share_code_active
  ON document_shares (share_code)
  WHERE is_active = true;

COMMIT;
