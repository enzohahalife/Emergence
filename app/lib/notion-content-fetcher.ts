import { Client } from '@notionhq/client';

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_TOKEN,
  timeoutMs: 30000,
});

// 内容缓存
const contentCache = new Map<string, { content: string; timestamp: number }>();
const CONTENT_CACHE_DURATION = 60 * 60 * 1000; // 1小时缓存

/**
 * 从 Notion 页面 URL 中提取页面 ID
 */
function extractPageIdFromUrl(url: string): string | null {
  try {
    // 处理不同格式的 Notion URL
    // 格式1: https://www.notion.so/workspace/Page-Title-32位ID
    // 格式2: https://notion.so/32位ID
    // 格式3: https://www.notion.so/32位ID

    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // 提取32位的页面ID（通常在URL的最后部分）
    const matches = pathname.match(/([a-f0-9]{32})/i) ||
                   url.match(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);

    if (matches) {
      let pageId = matches[1];
      // 如果是32位格式，转换为标准UUID格式
      if (pageId.length === 32) {
        pageId = [
          pageId.slice(0, 8),
          pageId.slice(8, 12),
          pageId.slice(12, 16),
          pageId.slice(16, 20),
          pageId.slice(20, 32)
        ].join('-');
      }
      return pageId;
    }

    return null;
  } catch (error) {
    console.error('Error extracting page ID from URL:', error);
    return null;
  }
}

/**
 * 将 Notion 块转换为纯文本
 */
function blockToText(block: any): string {
  const { type } = block;

  switch (type) {
    case 'paragraph':
      return extractRichText(block.paragraph?.rich_text || []);

    case 'heading_1':
      return `# ${extractRichText(block.heading_1?.rich_text || [])}`;

    case 'heading_2':
      return `## ${extractRichText(block.heading_2?.rich_text || [])}`;

    case 'heading_3':
      return `### ${extractRichText(block.heading_3?.rich_text || [])}`;

    case 'bulleted_list_item':
      return `• ${extractRichText(block.bulleted_list_item?.rich_text || [])}`;

    case 'numbered_list_item':
      return `1. ${extractRichText(block.numbered_list_item?.rich_text || [])}`;

    case 'quote':
      return `> ${extractRichText(block.quote?.rich_text || [])}`;

    case 'code':
      const codeText = extractRichText(block.code?.rich_text || []);
      const language = block.code?.language || '';
      return `\`\`\`${language}\n${codeText}\n\`\`\``;

    case 'callout':
      const calloutText = extractRichText(block.callout?.rich_text || []);
      const icon = block.callout?.icon?.emoji || '💡';
      return `${icon} ${calloutText}`;

    case 'toggle':
      return extractRichText(block.toggle?.rich_text || []);

    case 'to_do':
      const checked = block.to_do?.checked ? '✅' : '☐';
      const todoText = extractRichText(block.to_do?.rich_text || []);
      return `${checked} ${todoText}`;

    case 'divider':
      return '---';

    case 'image':
      const imageUrl = block.image?.external?.url || block.image?.file?.url;
      const caption = extractRichText(block.image?.caption || []);
      return caption ? `![${caption}](${imageUrl})` : `![Image](${imageUrl})`;

    case 'video':
      const videoUrl = block.video?.external?.url || block.video?.file?.url;
      return `[Video](${videoUrl})`;

    case 'file':
      const fileUrl = block.file?.external?.url || block.file?.file?.url;
      const fileName = block.file?.name || 'File';
      return `[${fileName}](${fileUrl})`;

    case 'bookmark':
      const bookmarkUrl = block.bookmark?.url;
      const bookmarkCaption = extractRichText(block.bookmark?.caption || []);
      return bookmarkCaption ? `[${bookmarkCaption}](${bookmarkUrl})` : `[Bookmark](${bookmarkUrl})`;

    case 'link_preview':
      return `[Link](${block.link_preview?.url})`;

    case 'table':
      return '[Table content]'; // 表格内容需要特殊处理

    case 'column_list':
    case 'column':
      return ''; // 列布局通常包含子块

    default:
      // 对于未知类型，尝试提取任何可能的文本内容
      const textContent = extractAnyText(block);
      return textContent || '';
  }
}

/**
 * 从富文本数组中提取纯文本
 */
function extractRichText(richText: any[]): string {
  if (!richText || richText.length === 0) return '';

  return richText.map((text: any) => {
    let content = text.plain_text || '';

    // 保留一些基本格式
    if (text.annotations?.bold) {
      content = `**${content}**`;
    }
    if (text.annotations?.italic) {
      content = `*${content}*`;
    }
    if (text.annotations?.code) {
      content = `\`${content}\``;
    }
    if (text.annotations?.strikethrough) {
      content = `~~${content}~~`;
    }

    return content;
  }).join('');
}

/**
 * 尝试从任何块中提取文本内容
 */
function extractAnyText(block: any): string {
  // 递归搜索所有可能包含文本的属性
  function searchForText(obj: any): string[] {
    const texts: string[] = [];

    if (typeof obj === 'string') {
      texts.push(obj);
    } else if (Array.isArray(obj)) {
      obj.forEach(item => {
        texts.push(...searchForText(item));
      });
    } else if (obj && typeof obj === 'object') {
      // 特别查找 rich_text 和 plain_text 属性
      if (obj.rich_text && Array.isArray(obj.rich_text)) {
        texts.push(extractRichText(obj.rich_text));
      } else if (obj.plain_text) {
        texts.push(obj.plain_text);
      } else {
        Object.values(obj).forEach(value => {
          texts.push(...searchForText(value));
        });
      }
    }

    return texts;
  }

  return searchForText(block).filter(text => text.trim()).join(' ');
}

/**
 * 递归获取页面的所有子块
 */
async function getAllBlocks(pageId: string): Promise<any[]> {
  const allBlocks: any[] = [];

  async function fetchBlocks(blockId: string): Promise<void> {
    try {
      let cursor: string | undefined = undefined;

      do {
        const response: any = await notion.blocks.children.list({
          block_id: blockId,
          start_cursor: cursor,
          page_size: 100,
        });

        const blocks = response.results || [];
        allBlocks.push(...blocks);

        // 递归获取有子块的块
        for (const block of blocks) {
          if (block.has_children) {
            await fetchBlocks(block.id);
          }
        }

        cursor = response.next_cursor || undefined;
      } while (cursor);

    } catch (error) {
      console.error(`Error fetching blocks for ${blockId}:`, error);
    }
  }

  await fetchBlocks(pageId);
  return allBlocks;
}

/**
 * 从 Notion 页面获取完整内容（使用 Notion API）
 */
export async function fetchNotionPageContent(pageUrl: string): Promise<string | null> {
  try {
    // 检查缓存
    const cached = contentCache.get(pageUrl);
    if (cached && (Date.now() - cached.timestamp) < CONTENT_CACHE_DURATION) {
      console.log(`📦 Using cached content for ${pageUrl}`);
      return cached.content;
    }

    // 从URL提取页面ID
    const pageId = extractPageIdFromUrl(pageUrl);
    if (!pageId) {
      console.error('Could not extract page ID from URL:', pageUrl);
      return await fetchNotionPageContentFallback(pageUrl);
    }

    console.log(`🔄 Fetching content for page: ${pageId}`);

    // 获取页面的所有块
    const blocks = await getAllBlocks(pageId);

    if (blocks.length === 0) {
      console.warn(`No blocks found for page: ${pageId}`);
      return await fetchNotionPageContentFallback(pageUrl);
    }

    // 将所有块转换为文本
    const textBlocks = blocks
      .map(block => blockToText(block))
      .filter(text => text.trim().length > 0);

    const content = textBlocks.join('\n\n');

    // 缓存内容
    contentCache.set(pageUrl, {
      content,
      timestamp: Date.now()
    });

    console.log(`✅ Successfully fetched ${textBlocks.length} blocks (${content.length} characters)`);
    return content;

  } catch (error) {
    console.error('Error fetching Notion page content via API:', error);
    // 如果 API 方法失败，回退到网页抓取方法
    return await fetchNotionPageContentFallback(pageUrl);
  }
}

/**
 * 回退方法：通过网页抓取获取内容
 */
async function fetchNotionPageContentFallback(url: string): Promise<string | null> {
  try {
    // 确保 URL 是 Notion 页面 URL
    if (!url.includes('notion.so') && !url.includes('notion.site')) {
      return null;
    }

    console.log(`🔍 Fallback: Fetching content from Notion URL: ${url}`);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      console.warn(`❌ Failed to fetch Notion page: ${response.status}`);
      return null;
    }

    const html = await response.text();

    // 提取页面主要内容（简化版本）
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      // 移除 HTML 标签，提取纯文本
      const textContent = bodyMatch[1]
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      // 提取有意义的内容段落
      const paragraphs = textContent
        .split(/[.!?。！？]/)
        .filter(p => p.trim().length > 20)
        .slice(0, 10) // 取前10个段落
        .map(p => p.trim())
        .join('。\n\n');

      console.log(`✅ Successfully extracted content from Notion page (fallback)`);
      return paragraphs || null;
    }

    return null;
  } catch (error) {
    console.error('❌ Error fetching Notion page content (fallback):', error);
    return null;
  }
}

// 批量获取文章内容的函数（优化版本）
export async function enrichEntriesWithContent(entries: any[]): Promise<any[]> {
  const enrichedEntries: any[] = [];
  const batchSize = 3; // 控制并发数，避免过多请求

  console.log(`📚 开始批量获取 ${entries.length} 篇文章内容...`);

  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize);
    console.log(`🔄 处理批次 ${Math.floor(i / batchSize) + 1}/${Math.ceil(entries.length / batchSize)}`);

    // 并发处理当前批次
    const batchResults = await Promise.allSettled(
      batch.map(async (entry) => {
        const enrichedEntry = { ...entry };

        if (!entry.content && entry.url) {
          console.log(`📖 获取内容: ${entry.title}`);
          const content = await fetchNotionPageContent(entry.url);
          if (content) {
            enrichedEntry.content = content;
            console.log(`✅ 内容已添加: ${entry.title}`);
          } else {
            console.log(`⚠️ 未找到内容: ${entry.title}`);
          }
        }

        return enrichedEntry;
      })
    );

    // 处理批次结果
    batchResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        enrichedEntries.push(result.value);
      } else {
        console.error(`❌ 处理失败: ${batch[index].title}`, result.reason);
        enrichedEntries.push(batch[index]); // 添加原始条目
      }
    });

    // 批次间短暂延迟，避免请求过于频繁
    if (i + batchSize < entries.length) {
      await new Promise(resolve => setTimeout(resolve, 500)); // 减少到 0.5 秒
    }
  }

  console.log(`🎉 批量处理完成，成功处理 ${enrichedEntries.length} 篇文章`);
  return enrichedEntries;
}