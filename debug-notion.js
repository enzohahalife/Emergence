#!/usr/bin/env node

/**
 * Notion API 调试工具
 * 用于检测本地环境中的 Notion API 连接和数据获取问题
 */

const { Client } = require('@notionhq/client');
require('dotenv').config({ path: '.env.local' });

// 颜色输出工具
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function debugNotionAPI() {
  log('cyan', '🔍 开始 Notion API 调试检测...\n');

  // 1. 检查环境变量
  log('blue', '📋 步骤 1: 检查环境变量');
  const token = process.env.NOTION_API_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!token) {
    log('red', '❌ NOTION_API_TOKEN 未设置');
    return;
  } else {
    log('green', `✅ NOTION_API_TOKEN: ${token.substring(0, 10)}...`);
  }

  if (!databaseId) {
    log('red', '❌ NOTION_DATABASE_ID 未设置');
    return;
  } else {
    log('green', `✅ NOTION_DATABASE_ID: ${databaseId}`);
  }

  // 2. 初始化 Notion 客户端
  log('blue', '\n📋 步骤 2: 初始化 Notion 客户端');
  const notion = new Client({
    auth: token,
    timeoutMs: 30000,
  });
  log('green', '✅ Notion 客户端初始化成功');

  // 3. 测试数据库连接
  log('blue', '\n📋 步骤 3: 测试数据库连接');
  try {
    const database = await notion.databases.retrieve({
      database_id: databaseId,
    });
    log('green', `✅ 数据库连接成功: ${database.title[0]?.plain_text || '未命名数据库'}`);

    // 显示数据库属性
    log('yellow', '\n📊 数据库属性:');
    if (database.properties) {
      Object.entries(database.properties).forEach(([name, prop]) => {
        console.log(`  - ${name}: ${prop.type}`);
      });
    } else {
      log('yellow', '  无法获取数据库属性');
    }
  } catch (error) {
    log('red', `❌ 数据库连接失败: ${error.message}`);
    return;
  }

  // 4. 测试数据查询
  log('blue', '\n📋 步骤 4: 测试数据查询');
  try {
    let response;

    // 尝试不同的查询方法
    try {
      // 方法1: 使用 databases.query
      if (notion.databases && typeof notion.databases.query === 'function') {
        response = await notion.databases.query({
          database_id: databaseId,
          page_size: 5,
        });
      } else {
        throw new Error('databases.query method not available');
      }
    } catch (method1Error) {
      log('yellow', '⚠️  方法1失败，尝试方法2 (直接 fetch)...');

      // 方法2: 使用直接 fetch 调用（与应用相同）
      const apiResponse = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28',
        },
        body: JSON.stringify({
          page_size: 5,
        }),
      });

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        throw new Error(`HTTP ${apiResponse.status}: ${errorText}`);
      }

      response = await apiResponse.json();
    }

    log('green', `✅ 数据查询成功，共 ${response.results.length} 条记录`);

    if (response.results.length === 0) {
      log('yellow', '⚠️  数据库为空，没有找到任何记录');
      return;
    }

    // 显示前几条数据的基本信息
    log('yellow', '\n📄 数据预览:');
    response.results.slice(0, 3).forEach((page, index) => {
      console.log(`\n  记录 ${index + 1}:`);
      console.log(`    ID: ${page.id}`);

      // 尝试提取标题
      const titleProp = Object.entries(page.properties).find(([name, prop]) => prop.type === 'title');
      if (titleProp) {
        const title = titleProp[1].title?.[0]?.plain_text || '无标题';
        console.log(`    标题: ${title}`);
      }

      // 尝试提取URL
      const urlProp = Object.entries(page.properties).find(([name, prop]) => prop.type === 'url');
      if (urlProp) {
        const url = urlProp[1].url || '无URL';
        console.log(`    URL: ${url}`);
      }

      // 显示所有属性名称
      console.log(`    所有属性: ${Object.keys(page.properties).join(', ')}`);
    });

  } catch (error) {
    log('red', `❌ 数据查询失败: ${error.message}`);
    return;
  }

  // 5. 测试应用的数据获取函数
  log('blue', '\n📋 步骤 5: 测试应用数据获取函数');
  try {
    // 动态导入应用的 notion 模块
    const { getAllNotionEntries } = await import('./app/lib/notion.js');
    const entries = await getAllNotionEntries();

    log('green', `✅ 应用数据获取成功，共 ${entries.length} 条记录`);

    if (entries.length > 0) {
      log('yellow', '\n📄 应用数据预览:');
      entries.slice(0, 3).forEach((entry, index) => {
        console.log(`\n  条目 ${index + 1}:`);
        console.log(`    ID: ${entry.id}`);
        console.log(`    标题: ${entry.title || '无标题'}`);
        console.log(`    URL: ${entry.url || '无URL'}`);
        console.log(`    作者: ${entry.author_name || '无作者'}`);
      });
    }
  } catch (error) {
    log('red', `❌ 应用数据获取失败: ${error.message}`);
    log('yellow', '💡 提示: 请确保在项目根目录运行此脚本');
  }

  log('cyan', '\n🎉 调试检测完成！');
}

// 运行调试
debugNotionAPI().catch(error => {
  log('red', `💥 调试过程中发生错误: ${error.message}`);
  console.error(error);
});