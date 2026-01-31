# Vercel 部署问题排查指南

## 🚨 Vercel 上无法显示数据的常见原因

### 1. 环境变量未配置 (最常见)

Vercel 不会自动读取 `.env.local` 文件，需要在 Vercel 控制台手动配置。

**解决步骤:**

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 找到你的项目 (Emergence)
3. 进入 **Settings** → **Environment Variables**
4. 添加以下环境变量:

```
NOTION_API_TOKEN = ntn_your_actual_token_here
NOTION_DATABASE_ID = your-actual-database-id-here
```

5. 选择环境: **Production**, **Preview**, **Development** (建议全选)
6. 点击 **Save**
7. 重新部署项目

### 2. 构建时数据获取失败

由于我们移除了 fallback 数据，如果构建时 Notion API 不可用，页面会显示空白。

**检查方法:**
- 查看 Vercel 构建日志中是否有 Notion API 错误
- 查看是否有 "❌ All Notion API attempts failed" 的日志

**解决方案:**
```bash
# 在本地测试构建
npm run build

# 如果构建失败，检查 Notion API 连接
npm run debug
```

### 3. 服务端渲染 (SSR) 问题

Next.js 在服务端预渲染页面时可能遇到网络限制。

**解决方案:**
- 增加 API 超时时间
- 添加更好的错误处理
- 考虑使用客户端渲染作为备选

### 4. Notion API 权限问题

生产环境可能有不同的网络限制。

**检查项目:**
- Notion 集成是否有正确的权限
- 数据库是否对集成开放
- API Token 是否有效

## 🔧 立即修复步骤

### 步骤 1: 配置 Vercel 环境变量

1. 访问: https://vercel.com/dashboard
2. 选择你的项目
3. Settings → Environment Variables
4. 添加:
   - `NOTION_API_TOKEN`: `ntn_your_actual_token_here`
   - `NOTION_DATABASE_ID`: `your-actual-database-id-here`

### 步骤 2: 重新部署

在 Vercel Dashboard 中:
1. 进入 **Deployments** 标签
2. 点击最新部署右侧的 **...** 菜单
3. 选择 **Redeploy**

### 步骤 3: 检查部署日志

1. 点击部署记录查看详细日志
2. 查找以下关键信息:
   - `🔄 Notion API attempt`
   - `✅ Notion API success`
   - `❌ Notion API attempts failed`

### 步骤 4: 添加生产环境调试

如果问题仍然存在，可以临时添加更详细的日志。

## 🛠️ 高级解决方案

### 方案 1: 添加环境变量验证

创建 `vercel.json` 配置文件:

```json
{
  "env": {
    "NOTION_API_TOKEN": "@notion-api-token",
    "NOTION_DATABASE_ID": "@notion-database-id"
  },
  "build": {
    "env": {
      "NOTION_API_TOKEN": "@notion-api-token",
      "NOTION_DATABASE_ID": "@notion-database-id"
    }
  }
}
```

### 方案 2: 添加构建时验证

在 `package.json` 中添加构建前检查:

```json
{
  "scripts": {
    "prebuild": "node -e \"if(!process.env.NOTION_API_TOKEN) throw new Error('NOTION_API_TOKEN required')\""
  }
}
```

### 方案 3: 客户端渲染备选

如果 SSR 有问题，可以添加客户端渲染:

```typescript
// 在页面组件中添加
import { useEffect, useState } from 'react';

export default function Home() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 客户端获取数据
    fetch('/api/entries')
      .then(res => res.json())
      .then(data => {
        setEntries(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  return <FeedManager entries={entries} />;
}
```

## 📊 调试 Vercel 部署

### 查看实时日志

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 查看实时日志
vercel logs [deployment-url]
```

### 本地模拟生产环境

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

## 🎯 快速检查清单

- [ ] Vercel 环境变量已配置
- [ ] 重新部署已完成
- [ ] 构建日志无错误
- [ ] Notion API Token 有效
- [ ] 数据库权限正确
- [ ] 本地构建成功

## 💡 常见错误及解决

### 错误: "NOTION_API_TOKEN is not defined"
**解决**: 在 Vercel 控制台配置环境变量

### 错误: "Invalid request URL"
**解决**: 检查 NOTION_DATABASE_ID 格式是否正确

### 错误: "Unauthorized"
**解决**: 检查 Notion 集成权限和数据库访问权限

### 错误: "Timeout"
**解决**: 增加 API 超时时间或添加重试机制

如果按照以上步骤操作后仍有问题，请提供 Vercel 部署日志的具体错误信息。