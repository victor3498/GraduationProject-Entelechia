# 数据库迁移脚本

本目录存放对 PostgreSQL 数据库结构的增量变更 SQL，按时间顺序命名，需要按顺序逐个执行。

## 执行方式

进入 `psql` 后通过 `\i` 引入：

```sql
\c tiptap_db
\i server/migrations/2026_04_28_create_document_shares.sql
```

或在命令行直接执行（替换 `<user>` `<db>` 为实际值）：

```bash
psql -U <user> -d <db> -f server/migrations/2026_04_28_create_document_shares.sql
```

## 当前迁移列表

| 文件 | 说明 |
| ---- | ---- |
| `2026_04_28_create_document_shares.sql` | 新增 `document_shares` 表，支持文档分享 + 基础权限（view / edit）。每文档每权限至多一条生效记录，撤销采用软删除。 |
