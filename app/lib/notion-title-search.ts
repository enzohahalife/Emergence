import { Client } from '@notionhq/client';

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_TOKEN,
  timeoutMs: 30000,
});

/**
 * 根据文章标题在Notion数据库中查找对应的页面
 */
export async function findNotionPageByTitle(title: string): Promise<string | null> {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!databaseId) {
      console.error('NOTION_DATABASE_ID not configured');
      return null;
    }

    console.log(`🔍 Searching for page with title: "${title}"`);

    const response = await (notion.databases as any).query({
      database_id: databaseId,
      filter: {
        property: 'Title', // 假设标题字段名为 'Title'
        title: {
          equals: title
        }
      }
    });

    if (response.results.length === 0) {
      console.log(`❌ No page found with title: "${title}"`);
      return null;
    }

    if (response.results.length > 1) {
      console.warn(`⚠️  Multiple pages found with title: "${title}", using the first one`);
    }

    const page = response.results[0];
    const pageId = page.id;

    console.log(`✅ Found page: ${pageId} for title: "${title}"`);
    return pageId;

  } catch (error) {
    console.error(`❌ Error searching for page with title "${title}":`, error);
    return null;
  }
}

/**
 * 根据文章标题获取Notion页面内容
 */
export async function fetchNotionContentByTitle(title: string): Promise<string | null> {
  try {
    // 首先根据标题查找页面ID
    const pageId = await findNotionPageByTitle(title);
    if (!pageId) {
      return null;
    }

    // 使用现有的内容获取函数
    const { fetchNotionPageContent } = await import('./notion-content-fetcher');

    // 构造页面URL（用于缓存键）
    const pageUrl = `https://www.notion.so/${pageId.replace(/-/g, '')}`;

    return await fetchNotionPageContent(pageUrl);

  } catch (error) {
    console.error(`❌ Error fetching content by title "${title}":`, error);
    return null;
  }
}

/**
 * 增强版：根据文章标题获取内容，支持模糊匹配
 */
export async function fetchNotionContentByTitleFuzzy(title: string): Promise<string | null> {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!databaseId) {
      console.error('NOTION_DATABASE_ID not configured');
      return null;
    }

    console.log(`🔍 Fuzzy searching for page with title: "${title}"`);

    // 首先尝试精确匹配
    let pageId = await findNotionPageByTitle(title);

    if (!pageId) {
      // 如果精确匹配失败，尝试包含匹配
      console.log(`🔍 Trying fuzzy search for: "${title}"`);

      const response = await (notion.databases as any).query({
        database_id: databaseId,
        filter: {
          property: 'Title',
          title: {
            contains: title.split(' ')[0] // 使用标题的第一个词进行模糊匹配
          }
        }
      });

      if (response.results.length > 0) {
        pageId = response.results[0].id;
        console.log(`✅ Found page via fuzzy search: ${pageId}`);
      }
    }

    if (!pageId) {
      console.log(`❌ No page found for title: "${title}"`);
      return null;
    }

    // 获取页面内容
    const { fetchNotionPageContent } = await import('./notion-content-fetcher');
    const pageUrl = `https://www.notion.so/${pageId.replace(/-/g, '')}`;

    return await fetchNotionPageContent(pageUrl);

  } catch (error) {
    console.error(`❌ Error in fuzzy search for title "${title}":`, error);
    return null;
  }
}
