
# 系统架构图

## 整体架构概览

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          View 层 (Frontend)                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────┐    ┌──────────────────────────────┐  │
│   │           Pages (页面层)          │    │       Components (组件层)      │  │
│   ├─────────────────────────────────┤    ├──────────────────────────────┤  │
│   │ • LoginOrRes (登录/注册页)       │    │ • DocumentList (文档列表)     │  │
│   │ • MainPage (主页面)              │    │ • DocumentToolbar (工具栏)    │  │
│   │ • UserPage (用户页面)            │    │ • DocumentItem (文档项)       │  │
│   │ • SharePage (分享管理页)         │    │ • ShareDialog (分享弹窗)      │  │
│   │ • SharedDocPage (分享文档页)     │    │ • Sidebar (侧边栏)            │  │
│   │ • MobileEditorPage (移动端编辑器) │    │ • Avatar (头像)               │  │
│   │ • MobileLoginOrRes (移动端登录)   │    │ • Button / Input / Toast      │  │
│   │ • MobileMainPage (移动端主页)     │    │ • Tooltip (提示框)            │  │
│   │ • MobileSharePage (移动端分享页)  │    │                              │  │
│   │ • MobileSharedDocPage (分享文档)  │    │                              │  │
│   └─────────────────────────────────┘    └──────────────────────────────┘  │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    Tiptap Editor (富文本编辑器)                      │   │
│   ├─────────────────────────────────────────────────────────────────────┤   │
│   │ • Nodes: heading, paragraph, list, code-block, image, blockquote    │   │
│   │ • Marks: bold, italic, underline, strike, code, highlight          │   │
│   │ • UI Buttons: 格式化按钮组、撤销/重做、链接、图片上传、导出PDF        │   │
│   │ • Extensions: 自定义扩展、主题切换、节点背景                         │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└──────────────────────────────┬──────────────────────────────────────────────┘
                              │ 用户事件交互 / 数据响应
                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Presenter 层 (业务逻辑层)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────────────┐  ┌──────────────────────┐  ┌─────────────────┐  │
│   │   Auth Module        │  │  Document Module     │  │  Share Module   │  │
│   │ (用户认证模块)        │  │   (文档管理模块)       │  │  (分享模块)      │  │
│   ├──────────────────────┤  ├──────────────────────┤  ├─────────────────┤  │
│   │ • 登录验证           │  │ • 创建文档           │  │ • 生成分享码     │  │
│   │ • 注册用户           │  │ • 编辑文档           │  │ • 撤销分享       │  │
│   │ • 登出处理           │  │ • 删除文档           │  │ • 分享列表       │  │
│   │ • 密码修改           │  │ • 查询文档列表       │  │ • 公开访问       │  │
│   │ • Token 管理         │  │ • 文档星标/搜索      │  │ • 协作文档       │  │
│   └──────────────────────┘  └──────────────────────┘  └─────────────────┘  │
│                                                                             │
│   ┌──────────────────────┐  ┌──────────────────────────────────────────┐   │
│   │ Preference Module    │  │                  API Layer                │   │
│   │  (偏好设置模块)       │  │  • auth.ts: 认证相关接口                  │   │
│   ├──────────────────────┤  │  • document.ts: 文档相关接口               │   │
│   │ • 主题设置           │  │  • share.ts: 分享相关接口                  │   │
│   │ • 用户偏好保存       │  │  • lastOpen.ts: 最近打开记录               │   │
│   │ • 布局配置           │  │  • http.ts: HTTP 请求封装                  │   │
│   └──────────────────────┘  └──────────────────────────────────────────┘   │
│                                                                             │
└──────────────────────────────┬──────────────────────────────────────────────┘
                              │ API 请求 / 响应
                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Service 层 (Backend)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      Express Server                                  │   │
│   │ • Middleware: cors, morgan, express.json, error-handler             │   │
│   │ • Routes: /api/auth, /api/doc, /api/share, /api/user-preference     │   │
│   │ • Guards: auth.middleware (JWT验证), guest.middleware               │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │
│   │AuthController│ │DocController │ │ShareController│ │PrefController│     │
│   │ (认证控制器)  │ │ (文档控制器) │ │ (分享控制器)  │ │ (偏好控制器)  │     │
│   ├──────────────┤ ├──────────────┤ ├──────────────┤ ├──────────────┤     │
│   │ • login      │ │ • createDoc  │ │ • createShare │ │ • getPref    │     │
│   │ • register   │ │ • updateDoc  │ │ • revokeShare │ │ • updatePref │     │
│   │ • logout     │ │ • deleteDoc  │ │ • listShares  │ │              │     │
│   │ • changePwd  │ │ • getDocList │ │ • getSharedDoc│ │              │     │
│   │              │ │ • getDocById │ │ • saveShared  │ │              │     │
│   └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘     │
│                                                                             │
│   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │
│   │ AuthService  │ │ DocService   │ │ ShareService │ │ PrefService  │     │
│   │  (认证服务)   │ │  (文档服务)   │ │  (分享服务)   │ │  (偏好服务)   │     │
│   ├──────────────┤ ├──────────────┤ ├──────────────┤ ├──────────────┤     │
│   │ • 密码加密   │ │ • 文档CRUD   │ │ • 生成分享码  │ │ • 偏好CRUD   │     │
│   │ • JWT生成    │ │ • 权限校验   │ │ • 权限控制   │ │              │     │
│   │ • Token管理  │ │ • 数据转换   │ │ • 幂等处理   │ │              │     │
│   └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘     │
│                                                                             │
└──────────────────────────────┬──────────────────────────────────────────────┘
                              │ 数据读写
                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Model 层 (数据层)                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      PostgreSQL (数据库)                            │   │
│   ├─────────────────────────────────────────────────────────────────────┤   │
│   │ • users: 用户信息 (id, username, password_hash)                     │   │
│   │ • documents: 文档数据 (id, user_id, title, content, is_starred)     │   │
│   │ • document_shares: 分享记录 (document_id, share_code, permission)   │   │
│   │ • refresh_tokens: 刷新令牌 (user_id, token, expires_at)             │   │
│   │ • user_preferences: 用户偏好 (user_id, last_opened_doc_id)          │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                     LocalStorage (前端存储)                          │   │
│   │ • accessToken: 访问令牌                                              │   │
│   │ • refreshToken: 刷新令牌                                             │   │
│   │ • lastOpen: 最近打开文档记录                                         │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 架构分层说明

### 1. View 层 (视图层)

负责用户界面展示和用户交互，采用 React 组件化架构。

| 模块 | 职责 | 关键文件 |
|------|------|----------|
| Pages | 页面级组件，路由入口 | `pages/LoginOrRes.tsx`, `pages/mainPage.tsx`, `pages/UserPage.tsx`, `pages/SharePage.tsx`, `pages/SharedDocPage.tsx` |
| Mobile Pages | 移动端页面 | `pages/mobile/MobileEditorPage.tsx`, `pages/mobile/MobileSharePage.tsx`, `pages/mobile/MobileSharedDocPage.tsx` |
| Layout | 布局组件 | `layouts/MainLayout.tsx`, `components/component/layout/Sidebar/` |
| Document Components | 文档相关组件 | `components/component/document/DocumentList.tsx`, `components/component/document/ShareDialog.tsx` |
| UI Components | 通用 UI 组件 | `components/component/ui/` (Button, Input, Avatar, Toast, Tooltip) |
| Tiptap Editor | 富文本编辑器核心 | `components/tiptap-ui/`, `components/tiptap-node/`, `components/tiptap-extension/` |

### 2. Presenter 层 (业务逻辑层)

处理业务逻辑和数据交互，作为 View 层和 Service 层的桥梁。

| 模块 | 职责 | 关键文件 |
|------|------|----------|
| Auth Module | 用户认证逻辑 | `api/auth.ts`, `store/modules/auth.ts` |
| Document Module | 文档管理逻辑 | `api/document.ts`, `hooks/use-tiptap-editor.ts` |
| Share Module | 文档分享逻辑 | `api/share.ts`, `lib/share-code.ts` |
| Preference Module | 用户偏好管理 | `hooks/` 相关 hooks, `api/lastOpen.ts` |
| HTTP Layer | 网络请求封装 | `lib/http.ts` |
| Router | 路由管理 | `router/routes.tsx`, `router/app-router.tsx`, `router/mobile-router.tsx`, `router/guards.tsx` |
| Utils | 工具函数 | `lib/export-pdf.ts`, `lib/tiptap-utils.ts` |

### 3. Service 层 (服务层)

后端服务层，基于 Express.js 构建 RESTful API。

| 模块 | 职责 | 关键文件 |
|------|------|----------|
| Controllers | 请求处理入口 | `controllers/auth.controller.js`, `controllers/document.controller.js`, `controllers/share.controller.js`, `controllers/userPreference.controller.js` |
| Services | 业务逻辑处理 | `services/auth.service.js`, `services/document.service.js`, `services/share.service.js`, `services/userPreference.service.js` |
| Models | 数据访问层 | `models/user.model.js`, `models/document.model.js`, `models/share.model.js`, `models/refreshToken.model.js`, `models/userPreference.model.js` |
| Middlewares | 请求中间件 | `middlewares/auth.middleware.js`, `middlewares/error.middleware.js`, `middlewares/guest.middleware.js` |
| Routes | 路由配置 | `routes/auth.routes.js`, `routes/document.routes.js`, `routes/share.routes.js`, `routes/userPreference.routes.js`, `routes/index.js` |
| Utils | 工具函数 | `utils/jwt.js`, `utils/password.js`, `utils/response.js` |

### 4. Model 层 (数据层)

负责数据持久化存储，基于 PostgreSQL 数据库。

| 存储类型 | 职责 | 关键文件/配置 |
|----------|------|--------------|
| PostgreSQL | 核心业务数据存储 | `config/db.js`, `models/*.model.js`, `migrations/*.sql` |
| LocalStorage | 前端临时数据存储 | Token 管理、最近打开记录 |

---

## 核心数据流

### 用户认证流程
```
用户登录 → View层 → API层(loginApi) → Service层(auth.controller) → 
→ auth.service(验证密码) → JWT生成 → 返回Token → LocalStorage存储 → 页面跳转
```

### 文档操作流程
```
编辑文档 → View层(Tiptap编辑器) → API层(documentApi) → Service层(doc.controller) →
→ doc.service → PostgreSQL(documents) → 返回结果 → View层更新
```

### 文档分享流程
```
生成分享码 → View层(ShareDialog) → API层(createShareApi) → Service层(share.controller) →
→ share.service → PostgreSQL(document_shares) → 返回分享码 → View层展示
```

### 公开访问流程
```
访问分享链接 → View层(SharedDocPage) → API层(getSharedDocApi) → Service层(share.controller) →
→ share.service → PostgreSQL(document_shares + documents) → 返回文档 → View层展示
```

---

## 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 前端框架 | React | 18+ |
| 语言 | TypeScript | 5+ |
| 构建工具 | Vite | 6+ |
| 路由 | React Router | 6+ |
| 状态管理 | Redux | 8+ |
| 富文本编辑器 | Tiptap | 2+ |
| 样式 | Tailwind CSS + SCSS | 3+ |
| 后端框架 | Express.js | 4+ |
| 数据库 | PostgreSQL | 16+ |
| 认证 | JWT | - |
| HTTP 客户端 | Fetch API | - |
| PDF 导出 | html2canvas + jsPDF | - |

---

## 关键设计特点

1. **前后端分离**: 前端 React + 后端 Express，通过 REST API 通信
2. **JWT 认证**: 无状态认证机制，Token 存储在 LocalStorage
3. **组件化架构**: UI 组件高度复用，编辑器功能模块化
4. **响应式设计**: 支持桌面端和移动端，通过路由区分
5. **文档分享**: 支持基于分享码的公开访问，权限控制（view/edit）
6. **错误处理**: 统一的错误中间件和全局异常处理
7. **懒加载**: 路由级别代码分割，优化首屏加载性能
8. **幂等设计**: 分享码生成支持幂等操作，避免重复创建

---

*图 4-1 系统架构图*
