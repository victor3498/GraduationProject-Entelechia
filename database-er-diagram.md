
# 数据库 E-R 模型图

## 整体实体关系图

```
                              ┌─────────────────────────────┐
                              │         users               │
                              │         (用户表)            │
                              ├─────────────────────────────┤
                              │ • id (PK, UUID)            │
                              │ • username (UNIQUE)        │
                              │ • password_hash            │
                              │ • created_at               │
                              └─────────────┬─────────────┘
                                            │ 1:N
                                            │
                    ┌───────────────────────┼───────────────────────┐
                    │                       │                       │
                    ▼                       ▼                       ▼
        ┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
        │     documents       │   │   refresh_tokens    │   │  user_preferences   │
        │      (文档表)        │   │    (刷新令牌表)      │   │    (用户偏好表)       │
        ├─────────────────────┤   ├─────────────────────┤   ├─────────────────────┤
        │ • id (PK, SERIAL)   │   │ • user_id (FK)      │   │ • user_id (PK,FK)   │
        │ • user_id (FK)      │   │ • token             │   │ • last_opened_doc_  │
        │ • title             │   │ • expires_at        │   │   id (FK)           │
        │ • content (JSONB)   │   └─────────────────────┘   └─────────────────────┘
        │ • is_starred        │                                     │
        │ • created_at        │                                     │ N:1
        │ • updated_at        │                                     │
        └─────────────┬───────┘◀────────────────────────────────────┘
                      │ 1:N
                      │
                      ▼
        ┌─────────────────────────────┐
        │      document_shares        │
        │       (文档分享表)           │
        ├─────────────────────────────┤
        │ • id (PK, SERIAL)           │
        │ • document_id (FK)          │
        │ • share_code (UNIQUE)       │
        │ • permission (view/edit)    │
        │ • is_active                 │
        │ • created_at                │
        │ • revoked_at                │
        └─────────────────────────────┘
```

---

## 实体详细结构

### 1. users（用户表）

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | 用户唯一标识，自动生成UUID |
| username | VARCHAR(50) | UNIQUE, NOT NULL | 用户名，唯一且非空 |
| password_hash | TEXT | NOT NULL | 密码哈希值 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

**索引**：`username` 唯一索引

---

### 2. documents（文档表）

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | SERIAL | PRIMARY KEY | 文档唯一标识，自增序列 |
| user_id | UUID | NOT NULL, FOREIGN KEY | 所属用户 ID |
| title | VARCHAR(255) | - | 文档标题 |
| content | JSONB | NOT NULL | 文档内容，JSON格式存储 |
| is_starred | BOOLEAN | DEFAULT FALSE | 是否星标收藏 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 更新时间 |

**约束**：
```sql
CONSTRAINT fk_documents_user
  FOREIGN KEY (user_id)
  REFERENCES users(id)
  ON DELETE CASCADE
```

**索引**：`user_id` 外键索引，`updated_at` 索引（用于排序）

---

### 3. document_shares（文档分享表）

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | SERIAL | PRIMARY KEY | 分享记录唯一标识，自增序列 |
| document_id | INTEGER | NOT NULL, FOREIGN KEY | 关联文档 ID |
| share_code | VARCHAR(16) | NOT NULL, UNIQUE | 分享链接唯一码（12位base64url） |
| permission | VARCHAR(8) | NOT NULL, CHECK IN ('view','edit') | 权限类型：只读/可编辑 |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | 是否生效（软删除标记） |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| revoked_at | TIMESTAMP | - | 撤销时间 |

**设计要点**：
- 采用软删除（`is_active=false`），便于审计和历史追溯
- 每个文档对每种权限（view/edit）最多只能存在1条生效记录，由部分唯一索引保证
- 原文档删除时自动级联删除所有关联分享记录

**约束**：
```sql
FOREIGN KEY (document_id)
REFERENCES documents(id)
ON DELETE CASCADE

CHECK (permission IN ('view','edit'))
```

**索引**：
- `share_code` 唯一索引
- `idx_active_share_per_perm`: `(document_id, permission)` 部分唯一索引（仅 is_active=true）
- `idx_share_code_active`: `share_code` 部分索引（仅 is_active=true）

---

### 4. refresh_tokens（刷新令牌表）

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| user_id | UUID | NOT NULL, FOREIGN KEY | 用户 ID |
| token | VARCHAR(255) | NOT NULL, UNIQUE | 刷新令牌 |
| expires_at | TIMESTAMP | NOT NULL | 过期时间 |

**约束**：
```sql
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE
```

**索引**：`token` 唯一索引，`user_id` 外键索引

---

### 5. user_preferences（用户偏好表）

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| user_id | UUID | PRIMARY KEY, FOREIGN KEY | 用户 ID（唯一，主键） |
| last_opened_doc_id | INTEGER | FOREIGN KEY | 最后打开的文档 ID |

**约束**：
```sql
CONSTRAINT fk_pref_user
  FOREIGN KEY (user_id)
  REFERENCES users(id)
  ON DELETE CASCADE

CONSTRAINT fk_pref_doc
  FOREIGN KEY (last_opened_doc_id)
  REFERENCES documents(id)
  ON DELETE SET NULL
```

**索引**：`user_id` 主键索引，`last_opened_doc_id` 外键索引

---

## 实体关系说明

| 关系 | 类型 | 描述 |
|------|------|------|
| users → documents | 一对多 (1:N) | 一个用户可以拥有多个文档，用户删除时级联删除文档 |
| documents → document_shares | 一对多 (1:N) | 一个文档可以生成多条分享记录（view/edit两种权限），文档删除时级联删除分享记录 |
| users → refresh_tokens | 一对多 (1:N) | 一个用户可以拥有多个刷新令牌，用户删除时级联删除令牌 |
| users → user_preferences | 一对一 (1:1) | 一个用户对应一条偏好记录，用户删除时级联删除偏好 |
| user_preferences → documents | 多对一 (N:1) | 偏好记录关联到一个文档，文档删除时偏好字段设为 NULL |

---

## 建表语句

### users 表
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### documents 表
```sql
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  title VARCHAR(255),
  content JSONB NOT NULL,
  is_starred BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_documents_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);
```

### document_shares 表
```sql
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
```

### refresh_tokens 表
```sql
CREATE TABLE refresh_tokens (
  user_id UUID NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,

  FOREIGN KEY (user_id)
  REFERENCES users(id)
  ON DELETE CASCADE
);
```

### user_preferences 表
```sql
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY,
  last_opened_doc_id INTEGER,

  CONSTRAINT fk_pref_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_pref_doc
    FOREIGN KEY (last_opened_doc_id)
    REFERENCES documents(id)
    ON DELETE SET NULL
);
```

---

## 核心业务流程数据流向

### 用户注册
```
INSERT INTO users (username, password_hash) VALUES (...)
```

### 用户创建文档
```
INSERT INTO documents (user_id, title, content) VALUES (...)
```

### 用户登录生成令牌
```
INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (...)
```

### 用户打开文档记录偏好
```
INSERT INTO user_preferences (user_id, last_opened_doc_id)
VALUES (...)
ON CONFLICT (user_id)
DO UPDATE SET last_opened_doc_id = EXCLUDED.last_opened_doc_id
```

### 创建文档分享链接
```
INSERT INTO document_shares (document_id, share_code, permission)
VALUES (...)
RETURNING id, document_id, share_code, permission
```

### 公开访问分享文档
```
SELECT s.*, d.*
FROM document_shares s
INNER JOIN documents d ON d.id = s.document_id
WHERE s.share_code = ?
  AND s.is_active = true
```

### 通过分享链接编辑文档
```
UPDATE documents d
SET content = ?, updated_at = CURRENT_TIMESTAMP
FROM document_shares s
WHERE s.document_id = d.id
  AND s.share_code = ?
  AND s.is_active = true
  AND s.permission = 'edit'
```

### 撤销文档分享
```
UPDATE document_shares
SET is_active = false, revoked_at = CURRENT_TIMESTAMP
WHERE share_code = ?
  AND document_id = ?
  AND is_active = true
```

---

*图 数据库 E-R 模型图*
