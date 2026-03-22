[根目录](../CLAUDE.md) > **server**

# server/ -- Nitro 服务端模块

## 变更记录 (Changelog)

| 日期 | 操作 | 说明 |
|------|------|------|
| 2026-03-22 | 初始创建 | 首次扫描生成 |

---

## 模块职责

Nuxt/Nitro 服务端目录，负责私密文章的管理员认证系统，包括登录/登出 API 端点、请求级认证中间件和 HMAC 签名工具。

---

## 入口与启动

- Nitro 自动加载 `server/api/`、`server/middleware/`、`server/utils/` 下的文件
- 无需手动注册路由

---

## 对外接口

### API 端点

| 方法 | 路径 | 文件 | 功能 |
|------|------|------|------|
| `POST` | `/api/admin-login` | `api/admin-login.post.ts` | 管理员登录：验证密钥，设置签名 Cookie |
| `POST` | `/api/admin-logout` | `api/admin-logout.post.ts` | 管理员登出：清除 Cookie |

### 请求/响应格式

**POST /api/admin-login**
- Request Body: `{ key: string }`
- Success Response: `{ success: true }` + Set-Cookie: `private_admin_token`
- Error: 400 (Missing key), 401 (Invalid key), 500 (Key not configured)

**POST /api/admin-logout**
- Request Body: (empty)
- Response: `{ success: true }` + Delete-Cookie: `private_admin_token`

### 中间件

| 文件 | 功能 |
|------|------|
| `middleware/admin-auth.ts` | 每次请求验证 `private_admin_token` Cookie，设置 `event.context.isPrivateAdmin` |

---

## 关键依赖与配置

- **node:crypto**: `createHmac`, `timingSafeEqual`, `randomBytes`
- **runtimeConfig.privateKey**: 管理员密钥，通过环境变量 `NUXT_PRIVATE_KEY` 设置
- **NUXT_PASSWORD_SECRET**: HMAC 签名密钥，缺省自动生成 32 字节随机值

---

## 数据模型

### Cookie Token 格式

```
private_admin_token = "{timestamp}:{hmac_hex}"
```

- `timestamp`: 签发时的 `Date.now()` 毫秒值
- `hmac_hex`: `HMAC-SHA256(secret, "admin:{timestamp}")` 的十六进制摘要
- Cookie 属性: `httpOnly: true`, `sameSite: lax`, `maxAge: 86400` (24h), `secure: true` (生产)

### 认证流程

```
1. 客户端 POST /api/admin-login { key: "xxx" }
2. 服务端对比 key === runtimeConfig.privateKey (timing-safe)
3. 生成 HMAC token, 设置 HttpOnly Cookie
4. 客户端刷新页面
5. 每次请求, middleware 验证 Cookie:
   - 解析 timestamp + signature
   - 检查 24 小时过期
   - 重算 HMAC 并 timing-safe 比对
   - 设置 event.context.isPrivateAdmin = true/false
6. 客户端 useState('private-admin') 读取 SSR 注入的认证状态
```

---

## 测试与质量

- **当前状态**: 无服务端测试
- **建议测试覆盖**:
  - admin-login: 缺 key / 错误 key / 正确 key / 未配置 privateKey
  - admin-auth middleware: 无 cookie / 过期 cookie / 篡改签名 / 有效 cookie
  - password-secret: 环境变量存在/不存在时的行为

---

## 常见问题 (FAQ)

**Q: 为什么使用 HMAC 签名而非 JWT?**
A: 轻量方案。仅需验证"管理员身份"单一用途，HMAC + 时间戳足够。无需存储 session，无需第三方库。

**Q: `NUXT_PASSWORD_SECRET` 不设置会怎样?**
A: 服务启动时自动生成随机 secret。但重启后所有已签发 Cookie 失效（secret 变化导致签名不匹配）。生产环境建议固定设置。

---

## 相关文件清单

```
server/
  tsconfig.json                   # 继承 .nuxt/tsconfig.server.json
  api/
    admin-login.post.ts           # 管理员登录 API
    admin-logout.post.ts          # 管理员登出 API
  middleware/
    admin-auth.ts                 # 请求级认证中间件
  utils/
    password-secret.ts            # HMAC 签名密钥管理
```
