import { NextRequest, NextResponse } from 'next/server';
import { getAllNotionEntries, testNotionConnection } from '../../lib/notion';

export async function GET(request: NextRequest) {
  try {
    // 检查环境变量
    const hasToken = !!process.env.NOTION_API_TOKEN;
    const hasDbId = !!process.env.NOTION_DATABASE_ID;

    // 测试连接
    const connectionTest = await testNotionConnection();

    // 获取数据
    let entries = [];
    let dataError = null;
    try {
      entries = await getAllNotionEntries();
    } catch (error) {
      dataError = error instanceof Error ? error.message : 'Unknown error';
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      config: {
        hasNotionToken: hasToken,
        hasNotionDbId: hasDbId,
        tokenPrefix: hasToken ? process.env.NOTION_API_TOKEN?.substring(0, 10) + '...' : 'missing',
        dbId: hasDbId ? process.env.NOTION_DATABASE_ID : 'missing',
      },
      connection: connectionTest,
      data: {
        success: !dataError,
        count: entries.length,
        error: dataError,
        sample: entries.slice(0, 2).map(entry => ({
          id: entry.id,
          title: entry.title,
          url: entry.url,
          author: entry.author_name,
        })),
      },
    });
  } catch (error) {
    return NextResponse.json({
      error: 'API route failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}