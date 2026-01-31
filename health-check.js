#!/usr/bin/env node

/**
 * 本地开发环境健康检查工具
 * 检查所有可能影响数据显示的因素
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// 颜色输出工具
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function healthCheck() {
  log('cyan', '🏥 开始本地环境健康检查...\n');

  let issues = [];
  let warnings = [];

  // 1. 检查项目结构
  log('blue', '📁 检查项目结构');
  const requiredFiles = [
    'package.json',
    '.env.local',
    'app/lib/notion.ts',
    'app/lib/notion-config.ts',
    'app/page.tsx',
    'app/types.ts',
  ];

  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      log('green', `✅ ${file}`);
    } else {
      log('red', `❌ ${file} 缺失`);
      issues.push(`缺失文件: ${file}`);
    }
  });

  // 2. 检查环境变量
  log('blue', '\n🔐 检查环境变量');
  const requiredEnvVars = ['NOTION_API_TOKEN', 'NOTION_DATABASE_ID'];

  requiredEnvVars.forEach(envVar => {
    const value = process.env[envVar];
    if (value) {
      log('green', `✅ ${envVar}: ${value.substring(0, 10)}...`);
    } else {
      log('red', `❌ ${envVar} 未设置`);
      issues.push(`环境变量未设置: ${envVar}`);
    }
  });

  // 3. 检查依赖包
  log('blue', '\n📦 检查关键依赖');
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredDeps = ['@notionhq/client', 'next', 'react'];

    requiredDeps.forEach(dep => {
      if (packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]) {
        const version = packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep];
        log('green', `✅ ${dep}: ${version}`);
      } else {
        log('red', `❌ ${dep} 未安装`);
        issues.push(`缺失依赖: ${dep}`);
      }
    });
  } catch (error) {
    log('red', `❌ 无法读取 package.json: ${error.message}`);
    issues.push('无法读取 package.json');
  }

  // 4. 检查 node_modules
  log('blue', '\n📚 检查 node_modules');
  if (fs.existsSync('node_modules')) {
    log('green', '✅ node_modules 存在');

    // 检查关键包是否存在
    const criticalPackages = ['@notionhq/client', 'next'];
    criticalPackages.forEach(pkg => {
      if (fs.existsSync(`node_modules/${pkg}`)) {
        log('green', `✅ ${pkg} 已安装`);
      } else {
        log('red', `❌ ${pkg} 未安装`);
        issues.push(`包未安装: ${pkg}`);
      }
    });
  } else {
    log('red', '❌ node_modules 不存在');
    issues.push('需要运行 npm install');
  }

  // 5. 检查 TypeScript 配置
  log('blue', '\n⚙️  检查 TypeScript 配置');
  if (fs.existsSync('tsconfig.json')) {
    log('green', '✅ tsconfig.json 存在');
  } else {
    log('yellow', '⚠️  tsconfig.json 不存在');
    warnings.push('建议添加 tsconfig.json');
  }

  // 6. 检查 Next.js 配置
  log('blue', '\n🔧 检查 Next.js 配置');
  if (fs.existsSync('next.config.js') || fs.existsSync('next.config.mjs')) {
    log('green', '✅ Next.js 配置文件存在');
  } else {
    log('yellow', '⚠️  Next.js 配置文件不存在（可选）');
  }

  // 7. 检查构建状态
  log('blue', '\n🏗️  检查构建状态');
  if (fs.existsSync('.next')) {
    log('green', '✅ .next 构建目录存在');
  } else {
    log('yellow', '⚠️  .next 构建目录不存在');
    warnings.push('可能需要运行 npm run build');
  }

  // 8. 生成诊断报告
  log('cyan', '\n📊 诊断报告');

  if (issues.length === 0) {
    log('green', '🎉 没有发现严重问题！');
  } else {
    log('red', `❌ 发现 ${issues.length} 个问题:`);
    issues.forEach((issue, index) => {
      console.log(`  ${index + 1}. ${issue}`);
    });
  }

  if (warnings.length > 0) {
    log('yellow', `⚠️  ${warnings.length} 个警告:`);
    warnings.forEach((warning, index) => {
      console.log(`  ${index + 1}. ${warning}`);
    });
  }

  // 9. 提供解决方案
  log('cyan', '\n💡 建议的解决步骤:');

  if (issues.some(issue => issue.includes('npm install'))) {
    console.log('1. 运行: npm install');
  }

  if (issues.some(issue => issue.includes('环境变量'))) {
    console.log('2. 检查 .env.local 文件中的环境变量设置');
  }

  console.log('3. 运行调试脚本: node debug-notion.js');
  console.log('4. 启动开发服务器: npm run dev');
  console.log('5. 检查浏览器控制台是否有错误信息');

  log('cyan', '\n🔍 如果问题仍然存在，请运行详细调试:');
  console.log('node debug-notion.js');
}

// 运行健康检查
healthCheck().catch(error => {
  log('red', `💥 健康检查过程中发生错误: ${error.message}`);
  console.error(error);
});