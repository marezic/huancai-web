# 换才 · 校园技能互换平台

基于 React + TypeScript + Vite + Tailwind CSS 的校园技能互换平台网页端，UI 参考《换才 · 微信小程序 UI 设计图》重排为网页布局。

**在线地址**：https://marezic.github.io/huancai-web/

## 本地运行

```bash
npm install
npm run dev      # 开发预览
npm run build    # 产出 dist/
```

## 功能

- 找技能 / 技能详情 / 发布技能（我能教 · 我想学双模式）
- 预约课程、技能互换、才分积分体系、每日签到
- 消息会话、排行榜、线下活动、技能认证
- AI 助手（DeepSeek，站长共享 Key，访客开箱即用；右上角齿轮可换自己的 Key）
- 云端模式：接入 Supabase 后，访客自动获得匿名账号，发布的技能实时同步到云端数据库，所有人可见（见下方接入指南）

## 接入 Supabase（让网站从演示版变成真正可用）

1. **建项目**：打开 [supabase.com](https://supabase.com) 免费注册 → `New Project`（区域建议选新加坡，免费档足够）。
2. **建数据表**：项目左侧 **SQL Editor** → 新建查询 → 粘贴本仓库 `supabase-schema.sql` 的全部内容 → 点 **Run** 执行。
3. **开匿名登录**：左侧 **Authentication → Sign In / Providers** → 找到 **Anonymous** 并开启（Allow anonymous sign-ins）。
4. **拿凭证**：左侧 **Project Settings → API**，复制 `Project URL` 和 `anon public` key。
5. **填进代码**：把两个值填入 `src/lib/supabase.ts` 顶部的 `SUPABASE_URL` 和 `SUPABASE_ANON_KEY`。
6. **重新构建部署**：`npm run build` 后把 `dist/` 发布到 GitHub Pages 即可。

不配置（留空）时网站自动保持纯演示模式，行为和之前完全一致。

> 注：`anon` key 是公开密钥，配合行级安全策略（所有人可读、只能写自己的数据）使用，写在
> 前端是 Supabase 官方认可的做法。

## 部署

仓库 `gh-pages` 分支由 `dist/` 构建产物组成，GitHub Pages 直接托管。修改源码后：

```bash
npm run build
# 将 dist/ 内容推送到 gh-pages 分支
```
