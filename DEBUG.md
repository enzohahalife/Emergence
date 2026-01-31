# 本地调试指南

当数据没有正常显示时，请按以下步骤进行调试：

## 🚀 快速检测

### 1. 运行健康检查
```bash
node health-check.js
```
这会检查所有基础环境配置。

### 2. 运行 Notion API 调试
```bash
node debug-notion.js
```
这会详细测试 Notion API 连接和数据获取。

## 🔍 详细调试步骤

### 步骤 1: 检查环境变量
确保 `.env.local` 文件包含正确的配置：
```env
NOTION_API_TOKEN=ntn_your_token_here
NOTION_DATABASE_ID=your-database-id-here
```

### 步骤 2: 检查依赖安装
```bash
npm install
```

### 步骤 3: 检查开发服务器
```bash
npm run dev
```
然后访问 http://localhost:3000

### 步骤 4: 检查浏览器控制台
1. 打开浏览器开发者工具 (F12)
2. 查看 Console 标签页是否有错误
3. 查看 Network 标签页是否有失败的请求

### 步骤 5: 检查服务器日志
在运行 `npm run dev` 的终端中查看是否有错误信息。

## 🐛 常见问题及解决方案

### 问题 1: 页面显示空白或无数据
**可能原因:**
- Notion API Token 无效或过期
- 数据库 ID 错误
- 数据库权限不足
- 网络连接问题

**解决方案:**
1. 运行 `node debug-notion.js` 检查 API 连接
2. 确认 Notion 集成有数据库访问权限
3. 检查网络连接

### 问题 2: 构建失败
**可能原因:**
- TypeScript 类型错误
- 缺失依赖
- 环境变量未设置

**解决方案:**
1. 运行 `npm run build` 查看具体错误
2. 检查 TypeScript 类型定义
3. 确保所有依赖已安装

### 问题 3: API 请求超时
**可能原因:**
- Notion API 响应慢
- 网络不稳定
- 数据库数据量过大

**解决方案:**
1. 增加超时时间设置
2. 减少单次请求的数据量
3. 检查网络连接稳定性

### 问题 4: 数据格式错误
**可能原因:**
- Notion 数据库字段名称变更
- 字段类型不匹配
- 数据结构变化

**解决方案:**
1. 检查 `app/lib/notion-config.ts` 中的字段映射
2. 运行调试脚本查看实际数据结构
3. 更新字段映射配置

## 📊 调试输出说明

### 健康检查输出
- ✅ 绿色: 正常
- ⚠️  黄色: 警告，不影响功能但建议修复
- ❌ 红色: 错误，需要立即修复

### Notion API 调试输出
- 显示环境变量状态
- 测试数据库连接
- 显示数据预览
- 测试应用数据获取函数

## 🆘 获取帮助

如果以上步骤都无法解决问题，请：

1. 收集调试脚本的完整输出
2. 记录浏览器控制台的错误信息
3. 记录服务器终端的错误日志
4. 提供具体的错误现象描述

## 📝 调试日志

运行调试脚本时，请保存输出结果以便分析：

```bash
# 保存健康检查结果
node health-check.js > health-check.log 2>&1

# 保存 Notion API 调试结果
node debug-notion.js > debug-notion.log 2>&1
```