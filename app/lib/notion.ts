import { Client } from '@notionhq/client';
import { RSWEntry } from '../types';

// Initialize Notion client with timeout configuration
const notion = new Client({
  auth: process.env.NOTION_API_TOKEN,
  timeoutMs: 30000, // 30 seconds timeout
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

// 添加内存缓存
let cachedEntries: RSWEntry[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 增加到30分钟缓存

// Helper function to extract text from Notion rich text
function extractText(richText: any[]): string | null {
  if (!richText || richText.length === 0) return null;
  return richText.map((text: any) => text.plain_text).join('');
}

// Helper function to extract date from Notion date property
function extractDate(dateProperty: any): string | null {
  if (!dateProperty || !dateProperty.start) return null;
  return dateProperty.start;
}

// Helper function to extract URL from Notion URL property
function extractUrl(urlProperty: any): string | null {
  if (!urlProperty) return null;
  return urlProperty;
}

// Helper function to extract file URL from Notion files property
function extractFileUrl(filesProperty: any[]): string | null {
  if (!filesProperty || filesProperty.length === 0) return null;
  const file = filesProperty[0];
  if (file.type === 'external') {
    return file.external.url;
  } else if (file.type === 'file') {
    return file.file.url;
  }
  return null;
}

// Helper function to extract number from Notion number property
function extractNumber(numberProperty: any): number | null {
  if (numberProperty === null || numberProperty === undefined) return null;
  return numberProperty;
}

// Test Notion connection and analyze database structure
export async function testNotionConnection(): Promise<{
  success: boolean;
  error?: string;
  databaseInfo?: any;
  sampleData?: any[];
  properties?: Record<string, any>;
}> {
  try {
    console.log('Testing Notion connection...');

    // Test 1: Try to retrieve database info
    let databaseInfo;
    try {
      databaseInfo = await notion.databases.retrieve({
        database_id: DATABASE_ID,
      });
      console.log('✅ Database retrieve successful');
    } catch (retrieveError: any) {
      console.log('❌ Database retrieve failed:', retrieveError.message);
    }

    // Test 2: Try to query database (this is the main method we need)
    let queryResult;
    try {
      // Use the correct Notion API method - try different approaches
      try {
        // Method 1: Try the standard databases.query method
        if ('query' in notion.databases && typeof (notion.databases as any).query === 'function') {
          queryResult = await (notion.databases as any).query({
            database_id: DATABASE_ID,
            page_size: 3,
          });
          console.log('✅ Database query successful (method 1)');
        } else {
          throw new Error('databases.query method not available');
        }
      } catch (method1Error) {
        console.log('Method 1 failed, trying method 2...');

        // Method 2: Try direct API call
        const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.NOTION_API_TOKEN}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28',
          },
          body: JSON.stringify({
            page_size: 3,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        queryResult = await response.json();
        console.log('✅ Database query successful (method 2)');
      }
    } catch (queryError: any) {
      console.log('❌ Database query failed:', queryError.message);
      return {
        success: false,
        error: `Query failed: ${queryError.message}`,
        databaseInfo,
      };
    }

    // Analyze the results
    const sampleData = queryResult?.results || [];
    const properties = sampleData.length > 0 ? sampleData[0].properties : {};

    return {
      success: true,
      databaseInfo,
      sampleData,
      properties,
    };

  } catch (error: any) {
    console.error('Notion connection test failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Helper function to extract multi-select values
function extractMultiSelect(multiSelectProperty: any[]): string[] {
  if (!multiSelectProperty || multiSelectProperty.length === 0) return [];
  return multiSelectProperty.map((item: any) => item.name);
}

// Helper function to extract select value
function extractSelect(selectProperty: any): string | null {
  if (!selectProperty) return null;
  return selectProperty.name;
}

// Helper function to extract created/edited time
function extractTime(timeProperty: any): string | null {
  if (!timeProperty) return null;
  return timeProperty;
}

// Convert Notion page to EnhancedArticle (new format)
function notionPageToEnhancedArticle(page: any, fieldMapping: Record<string, string>): any {
  const properties = page.properties;

  return {
    // 基础信息
    id: extractNumber(properties[fieldMapping.id]?.number) || Date.now(),
    title: extractText(properties[fieldMapping.title]?.title) || 'Untitled',
    url: extractUrl(properties[fieldMapping.url]?.url) || '',
    status: extractSelect(properties[fieldMapping.status]?.select) || 'Draft',
    category: extractMultiSelect(properties[fieldMapping.category]?.multi_select) || [],

    // 作者信息
    author_name: extractText(properties[fieldMapping.author]?.rich_text) || null,
    author_twitter: extractText(properties[fieldMapping.authorTwitter]?.rich_text) || null,
    author_bio: extractText(properties[fieldMapping.authorBio]?.rich_text) || null,

    // 推荐信息
    recommender_name: extractText(properties[fieldMapping.recommender]?.rich_text) || null,
    recommender_twitter: extractText(properties[fieldMapping.recommenderTwitter]?.rich_text) || null,
    recommendation: extractText(properties[fieldMapping.recommendation]?.rich_text) || null,

    // 时间字段
    publication_date: extractDate(properties[fieldMapping.publicationDate]?.date) || null,
    added_date: extractTime(properties[fieldMapping.addedDate]?.created_time) || new Date().toISOString(),
    last_modified: extractTime(properties[fieldMapping.lastModified]?.last_edited_time) || new Date().toISOString(),

    // 媒体资源
    featured_image: extractFileUrl(properties[fieldMapping.featuredImage]?.files) || null,
    screenshot: extractFileUrl(properties[fieldMapping.screenshot]?.files) || null,
    og_image: extractUrl(properties[fieldMapping.ogImage]?.url) || null,

    // 视觉设计
    primary_color: extractText(properties[fieldMapping.primaryColor]?.rich_text) || null,
    secondary_color: extractText(properties[fieldMapping.secondaryColor]?.rich_text) || null,
    theme: extractSelect(properties[fieldMapping.theme]?.select) || null,

    // SEO 专用
    seo_title: extractText(properties[fieldMapping.seoTitle]?.rich_text) || null,
    seo_description: extractText(properties[fieldMapping.seoDescription]?.rich_text) || null,
    keywords: extractMultiSelect(properties[fieldMapping.keywords]?.multi_select) || [],
    reading_time: extractNumber(properties[fieldMapping.readingTime]?.number) || null,

    // 统计字段
    views: extractNumber(properties[fieldMapping.views]?.number) || null,
    clicks: extractNumber(properties[fieldMapping.clicks]?.number) || null,
    quality_score: extractNumber(properties[fieldMapping.qualityScore]?.number) || null,
  };
}

// Convert Notion page to RSWEntry (frontend-matched version)
function notionPageToRSWEntry(page: any, fieldMapping?: Record<string, string>): RSWEntry {
  const properties = page.properties;

  // Use frontend-matched mapping by default
  const defaultMapping = {
    title: 'Title',
    url: 'URL',
    id: 'ID',
    author: 'Author',
    date: 'Date',
    image: 'Image',
    content: 'notion-page-content',
    seoTitle: 'SEO Title',
    seoDescription: 'SEO Description',
    keywords: 'Keywords',
  };

  const mapping = fieldMapping || defaultMapping;

  // Safe extraction with multiple fallback attempts
  const id = extractNumber(properties[mapping.id]?.number) ||
            extractNumber(properties.ID?.number) ||
            extractNumber(properties.id?.number) ||
            Date.now();

  const url = extractUrl(properties[mapping.url]?.url) ||
              extractUrl(properties.URL?.url) ||
              '';

  const title = extractText(properties[mapping.title]?.title) ||
                extractText(properties.Title?.title) ||
                'Untitled';

  // Extract content field
  const content = extractText(properties[mapping.content]?.rich_text) ||
                  extractText(properties['notion-page-content']?.rich_text) ||
                  extractText(properties.Content?.rich_text) ||
                  extractText(properties.content?.rich_text) ||
                  null;

  // Try multiple image field names
  const imageFiles = properties[mapping.image]?.files ||
                     properties.Image?.files ||
                     properties['Featured Image']?.files ||
                     properties.Screenshot?.files ||
                     [];

  const author = extractText(properties[mapping.author]?.rich_text) ||
                 extractText(properties.Author?.rich_text) ||
                 extractText(properties['Author Name']?.rich_text) ||
                 null;

  const publicationDate = extractDate(properties[mapping.date]?.date) ||
                         extractDate(properties.Date?.date) ||
                         extractDate(properties['Publication Date']?.date) ||
                         null;

  const imageUrl = extractFileUrl(imageFiles);

  // Extract SEO fields
  const seoTitle = extractText(properties[mapping.seoTitle]?.rich_text) ||
                   extractText(properties['SEO Title']?.rich_text) ||
                   null;

  const seoDescription = extractText(properties[mapping.seoDescription]?.rich_text) ||
                         extractText(properties['SEO Description']?.rich_text) ||
                         null;

  const keywords = extractMultiSelect(properties[mapping.keywords]?.multi_select) ||
                   extractMultiSelect(properties.Keywords?.multi_select) ||
                   [];

  return {
    id,
    url,
    title,
    content,
    screenshot: imageUrl,
    og_image: imageUrl,
    publication_date: publicationDate,
    author_name: author,
    author_twitter_screen_name: null,
    recommender_name: null,
    recommender_twitter_screen_name: null,
    gradient_start: null,
    gradient_end: null,
    seo_title: seoTitle,
    seo_description: seoDescription,
    keywords: keywords,
  };
}

// Helper function to find field by type
function findFieldByType(properties: any, type: string): string | null {
  for (const [name, property] of Object.entries(properties)) {
    if ((property as any).type === type) {
      return name;
    }
  }
  return null;
}

// Helper function to find field by name patterns
function findFieldByName(properties: any, patterns: string[]): string | null {
  for (const pattern of patterns) {
    if (properties[pattern]) {
      return pattern;
    }
  }
  return null;
}

// Fetch enhanced articles from Notion database (new format)
export async function getAllEnhancedArticles(fieldMapping?: Record<string, string>): Promise<any[]> {
  try {
    const articles: any[] = [];
    let cursor: string | undefined = undefined;

    // Use new field mapping by default
    const mapping = fieldMapping || (await import('./notion-config')).DEFAULT_FIELD_MAPPING;

    do {
      const response: any = await notion.request({
        path: `databases/${DATABASE_ID}/query`,
        method: 'post',
        body: {
          start_cursor: cursor,
          page_size: 100,
          filter: {
            property: (mapping as any).status || 'Status',
            select: {
              equals: 'Published'
            }
          },
          sorts: [
            {
              property: (mapping as any).addedDate || 'Added Date',
              direction: 'descending'
            }
          ]
        },
      });

      // Convert Notion pages to EnhancedArticle objects
      const pageArticles = response.results.map((page: any) =>
        notionPageToEnhancedArticle(page, mapping)
      );
      articles.push(...pageArticles);

      cursor = response.next_cursor || undefined;
    } while (cursor);

    return articles;
  } catch (error) {
    console.error('Error fetching enhanced articles from Notion:', error);
    return [];
  }
}
export async function getAllNotionEntries(fieldMapping?: Record<string, string>): Promise<RSWEntry[]> {
  // 检查缓存（除非强制刷新）
  const now = Date.now();
  const forceRefresh = process.env.FORCE_REFRESH === 'true';

  if (!forceRefresh && cachedEntries && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log(`📦 Using cached data (${Math.round((CACHE_DURATION - (now - cacheTimestamp)) / 1000)}s remaining)`);
    return cachedEntries;
  }

  if (forceRefresh) {
    console.log('🔄 Force refresh enabled, bypassing cache');
  }

  // 添加重试机制
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Notion API attempt ${attempt}/${maxRetries}`);

      const entries: RSWEntry[] = [];
      let cursor: string | undefined = undefined;

      // Use frontend-matched mapping by default
      const mapping = fieldMapping || (await import('./notion-config')).FRONTEND_MATCHED_MAPPING;

      do {
        let response;

        try {
          // Method 1: Try the standard databases.query method with timeout
          if (typeof (notion.databases as any).query === 'function') {
            const queryPromise: Promise<any> = (notion.databases as any).query({
              database_id: DATABASE_ID,
              start_cursor: cursor,
              page_size: 20, // 进一步减少页面大小
              // No filter or sort to avoid field name issues
            });

            // 增加超时时间
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error('Notion API timeout')), 45000);
            });

            response = await Promise.race([queryPromise, timeoutPromise]);
          } else {
            throw new Error('databases.query method not available');
          }
      } catch (method1Error) {
        // Method 2: Try direct API call with minimal query
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时

        try {
          const apiResponse: Response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.NOTION_API_TOKEN}`,
              'Content-Type': 'application/json',
              'Notion-Version': '2022-06-28',
            },
            body: JSON.stringify({
              start_cursor: cursor,
              page_size: 50, // 减少页面大小以提高稳定性
              // No filter or sort to avoid field name issues
            }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            throw new Error(`HTTP ${apiResponse.status}: ${errorText}`);
          }

          response = await apiResponse.json();
        } catch (fetchError) {
          clearTimeout(timeoutId);
          throw fetchError;
        }
      }

      // Convert Notion pages to RSWEntry objects
      const pageEntries = response.results.map((page: any) =>
        notionPageToRSWEntry(page, mapping)
      );
      entries.push(...pageEntries);

      cursor = response.next_cursor || undefined;
    } while (cursor);

      // Filter out entries with empty titles or URLs and sort by ID descending
      const validEntries = entries
        .filter(entry => entry.title && entry.title !== 'Untitled' && entry.url)
        .sort((a, b) => b.id - a.id);

      console.log(`✅ Notion API success on attempt ${attempt}, got ${validEntries.length} entries`);

      // 更新缓存
      cachedEntries = validEntries;
      cacheTimestamp = Date.now();
      console.log(`💾 Data cached for ${CACHE_DURATION / 1000}s`);


      return validEntries;

    } catch (error: any) {
      lastError = error;
      console.error(`❌ Notion API attempt ${attempt}/${maxRetries} failed:`, error.message);

      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // 指数退避，最大5秒
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  console.log('❌ All Notion API attempts failed, returning empty array');
  return [];
}