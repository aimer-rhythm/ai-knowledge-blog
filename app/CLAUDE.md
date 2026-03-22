[根目录](../CLAUDE.md) > **app**

# app/ -- Nuxt 前端应用模块

## 变更记录 (Changelog)

| 日期 | 操作 | 说明 |
|------|------|------|
| 2026-03-22 | 初始创建 | 首次扫描生成 |

---

## 模块职责

Nuxt 4 兼容模式下的前端应用目录，包含所有页面、组件、composables、工具函数、布局和样式。该模块构成了博客的完整前端渲染层。

---

## 入口与启动

- **应用入口**: `app/app.vue` -- 渲染 `<NuxtLoadingIndicator>` + `<NuxtLayout>` + `<NuxtPage>`
- **默认布局**: `app/layouts/default.vue` -- Header + main slot + Footer，带背景点阵图案
- **文章布局**: `app/layouts/article.vue` -- 三栏布局（左侧导航 / 主内容 / 右侧 TOC），响应式折叠

---

## 对外接口

### 页面路由

| 路由 | 文件 | 功能 |
|------|------|------|
| `/` | `pages/index.vue` | 首页：Hero + 分类入口 + 最新文章网格 + 分页 |
| `/categories` | `pages/categories/index.vue` | 分类列表页 |
| `/categories/:name` | `pages/categories/[name].vue` | 分类详情：该分类下文章列表 + 分页 |
| `/tags` | `pages/tags/index.vue` | 标签云页面 |
| `/tags/:name` | `pages/tags/[name].vue` | 标签详情：该标签下文章列表 + 分页 |
| `/archives` | `pages/archives.vue` | 归档时间线：按年-月分组 |
| `/about` | `pages/about.vue` | 关于页：站点介绍 + 技术栈 + 联系方式 |
| `/private` | `pages/private.vue` | 私密文章列表（需认证） |
| `/:slug+` | `pages/[...slug].vue` | 文章详情页（catch-all 路由） |

### Composables（自动导入）

| 名称 | 文件 | 功能 |
|------|------|------|
| `useArticles(options)` | `composables/useArticles.ts` | 文章列表查询，支持分类/标签过滤 + 分页 |
| `useCategories()` | `composables/useCategories.ts` | 全部分类及计数 |
| `useTags()` | `composables/useTags.ts` | 全部标签及计数 |
| `usePrivateAuth()` | `composables/usePrivateAuth.ts` | 私密认证状态 + login/logout 方法 |

### 工具函数（自动导入）

| 函数 | 文件 | 功能 |
|------|------|------|
| `parseContentDate()` | `utils/content.ts` | 解析 YYYY-M-D 或 ISO 日期 |
| `getContentDateValue()` | `utils/content.ts` | 日期转时间戳数值 |
| `isPrivateArticle()` | `utils/content.ts` | 判断私密文章 |
| `compareContentDatesDesc()` | `utils/content.ts` | 日期降序比较器 |
| `compareContentDatesAsc()` | `utils/content.ts` | 日期升序比较器 |
| `formatContentDate()` | `utils/content.ts` | 本地化日期格式化 |

---

## 关键依赖与配置

- **@nuxt/content**: 内容查询 API (`queryCollection('content')`)
- **@nuxtjs/i18n**: `useI18n()` 获取翻译函数，`prefix_except_default` 策略
- **@nuxtjs/color-mode**: `useColorMode()` 获取/设置主题
- **@nuxt/image**: `<NuxtImg>` 组件用于图片优化
- **Tailwind CSS**: utility-first 样式，自定义 primary/zinc 调色板，Typography 插件

### 自定义 Tailwind 主题

- 主色: `primary-50` ~ `primary-950`（蓝紫色系）
- 中性色: `zinc-50` ~ `zinc-950`
- 字体: Inter + system fallback
- Typography 插件: 自定义 prose 暗色模式配色

### 全局 CSS (`assets/css/main.css`)

- 页面/布局过渡动画
- `.container-content` -- 响应式容器（max-w-7xl + padding）
- Prose 代码块/链接/图片样式覆盖
- KaTeX 暗色模式适配

---

## 数据模型

### Content Schema (`content.config.ts`)

```typescript
{
  title: string       // 必填
  description: string // 可选
  date: string        // 必填, YYYY-MM-DD
  category: string    // 可选
  tags: string[]      // 可选
  image: string       // 可选, 封面图路径
  private: boolean    // 可选, 标记为私密文章
}
```

---

## 组件清单

### blog/ (12 组件)

| 组件 | 职责 |
|------|------|
| `ArticleCard` | 文章卡片（封面 + 日期 + 标题 + 描述 + 标签） |
| `ArticleCover` | 文章封面（真实图片 or 基于分类的动态占位图） |
| `ArticleMeta` | 文章元信息（日期 + 分类 + 标签 + 阅读时间） |
| `AdminGate` | 管理员密钥输入表单 |
| `CategoryCard` | 分类卡片（图标 + 名称 + 描述 + 计数） |
| `Pagination` | 分页控件（带省略号的页码导航） |
| `PrevNextNav` | 前一篇/后一篇导航 |
| `ReadingNavigator` | 阅读导航器（左侧栏，按分类分组的文章列表） |
| `RelatedArticles` | 相关文章推荐（同分类，最多 3 篇） |
| `TableOfContents` | 文章目录（TOC，IntersectionObserver 高亮当前标题） |
| `TagList` | 标签列表（彩色标签，sm/md/lg 尺寸） |
| `Timeline` | 归档时间线（按年-月分组） |

### ui/ (3 组件)

| 组件 | 职责 |
|------|------|
| `ThemeToggle` | 暗色/亮色主题切换按钮（带旋转动画） |
| `LanguageSwitcher` | 中/英语言切换按钮 |
| `SearchDialog` | 全局搜索对话框（Cmd+K 快捷键，防抖搜索，键盘导航） |

### layout/ (3 组件)

| 组件 | 职责 |
|------|------|
| `AppHeader` | 固定顶部导航栏（桌面/移动响应式，含搜索按钮） |
| `AppFooter` | 页脚（品牌 + 导航链接 + 社交 + 版权） |
| `AppSidebar` | 侧边栏容器（圆角卡片样式） |

### content/ (2 组件)

| 组件 | 职责 |
|------|------|
| `CodeGroup` | Markdown 代码组（多标签页切换） |
| `Callout` | Markdown 高亮提示框（info/tip/warning/danger） |

---

## 测试与质量

- 测试文件位于 `tests/` 目录
- 已测试: `utils/content.ts`, `TagList.vue`, `PrevNextNav.vue`, `AdminGate.vue`
- 未测试: 所有 composables, 大部分组件, 页面级集成

---

## 常见问题 (FAQ)

**Q: 为什么组件使用 `<BlogArticleCard>` 而不是 `<ArticleCard>`?**
A: Nuxt 自动导入组件时，以目录路径为前缀。`components/blog/ArticleCard.vue` 对应 `<BlogArticleCard>`。

**Q: 私密文章如何工作?**
A: 文章的 `private: true` 或路径在 `/private/` 下即为私密。用户需输入 `NUXT_PRIVATE_KEY` 对应的密钥通过 `/api/admin-login` 验证，获取 HttpOnly Cookie 后刷新页面解锁内容。

**Q: 文章排序和分页为什么在客户端完成?**
A: `@nuxt/content` v3 的 SQLite 查询 API 有限制，排序和分页逻辑在 composable 的 `.then()` 链中用 JS 实现。

---

## 相关文件清单

```
app/
  app.vue                         # 应用入口
  assets/css/main.css             # 全局样式
  layouts/
    default.vue                   # 默认布局
    article.vue                   # 文章布局（三栏）
  pages/
    index.vue                     # 首页
    about.vue                     # 关于
    archives.vue                  # 归档
    private.vue                   # 私密文章列表
    [...slug].vue                 # 文章详情（catch-all）
    categories/index.vue          # 分类列表
    categories/[name].vue         # 分类详情
    tags/index.vue                # 标签云
    tags/[name].vue               # 标签详情
  components/
    blog/                         # 博客相关组件 (12)
    ui/                           # 通用 UI 组件 (3)
    layout/                       # 布局组件 (3)
    content/                      # Markdown 内容组件 (2)
  composables/
    useArticles.ts                # 文章查询 composable
    useCategories.ts              # 分类查询 composable
    useTags.ts                    # 标签查询 composable
    usePrivateAuth.ts             # 私密认证 composable
  utils/
    content.ts                    # 日期解析/私密判断/排序/格式化
```
