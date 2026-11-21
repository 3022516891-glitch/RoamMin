# 青旅 A E 模块前端

这是旅行规划社交平台的 A 模块（用户与个人中心）与 E 模块（社区与社交）开发起点。React 18 + Vite 5 + TypeScript + Tailwind CSS 3 + Zustand + React Router 6 + Axios。

## 启动

本机已安装依赖时，双击 `启动前端.cmd` 即可启动。双击 `打开VSCode.cmd` 会使用 D 盘扩展与用户设置打开项目。也可在 VS Code 的“终端 → 运行任务”选择“启动 A E 前端”。这些快捷入口使用本机已确认的 Node 与 VS Code 路径，换电脑时需要调整。

需要 Node.js 18 或更高版本。打开本目录，在 VS Code 终端执行：

```sh
npm install
npm run dev
```

访问终端打印的本地网址，一般为 http://localhost:5173。`npm run build` 会进行 TypeScript 检查并生成 dist。

如果已经安装 pnpm，可以使用 `pnpm install`、`pnpm dev`、`pnpm build`。项目附带 pnpm-lock.yaml 时 pnpm 会按锁文件安装；npm 首次运行会生成 package-lock.json。团队统一选择一种包管理器。

## 演示账号与边界

默认是本地演示模式。邮箱 demo@travel.test，密码 demo123456。注册演示账号也使用此密码；不保存真实密码，仅替换本地单用户资料。演示 Token 不是真实 JWT，演示数据保存在当前浏览器 localStorage；不适用于生产，也不模拟多用户隔离。

已实现：登录注册表单、刷新恢复登录、路由守卫、退出、资料编辑、用户主页、社区浏览、公开行程摘要、点赞收藏、我的发布与收藏、搭子帖增删改查与筛选、成员搜索/添加/移除。游客可浏览社区、公开行程、搭子帖子与用户主页。互动及个人中心需要登录。

行程创建、编辑、地图和完整日程由 B 模块接入。成员管理在“我的发布”中打开，仅 Owner 可见。头像先使用 URL；图片上传、私信、关注粉丝、英文翻译和后端联调尚未实现。当前没有分页，先使用列表协议，需要与后端确认分页响应后再接入。

## 接入后端

将 `.env.example` 复制为 `.env.local`，修改 `VITE_USE_MOCK=false`。开发服务器默认代理 `/api` 到 `http://localhost:8080`，接口根路径 `/api/v1`。修改环境变量后重启开发服务器。

统一响应约定：`{ code: 0, message: 'success', data: ... }`，前端模型见 `src/types/index.ts`。后端字段（例如 nickname / avatarUrl）、列表数组、详情 days 摘要、JWT 返回 token 及枚举需与后端一致；这里是待联调的前端协议，并非已验证的后端实现。

用户信息由 `/auth/me` 校验，Authorization 自动携带 Bearer Token。会话接口返回 401 清理状态；登录失败留在表单。后端必须独立校验所有操作权限。课程起步方案使用 localStorage Token，需要处理 XSS 风险后再考虑部署。

文档未明确的接口目前作为待确认约定：

- GET /users/me/favorites：当前用户收藏行程数组
- GET /buddy/posts/mine：当前用户搭子帖数组
- PUT /users/me：返回更新后的 User
- POST/PUT /buddy/posts：返回完整 BuddyPost
- GET /community/trips/:id：含 days 字符串摘要数组
- 点赞收藏与成员增删接口成功返回统一响应，可 data:null

## 阅读代码顺序

1. `src/main.tsx` 应用入口、会话初始化
2. `src/router/index.tsx` 公开路由与受保护路由
3. `src/stores/authStore.ts` 全局登录状态
4. `src/components/AuthGuard.tsx` 路由权限控制
5. `src/api/client.ts` Axios 与响应约定
6. `src/pages` 页面；`src/components` 卡片与成员管理
7. `src/api/mock.ts` 演示数据与本地保存

页面文案目前为中文，后续按项目组 i18n 方案抽取翻译 key。项目源需求位于 docs/项目开发文档.md。
