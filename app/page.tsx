import type { Metadata } from 'next';
import { DEFAULT_SEO_CONFIG } from './lib/seo';
import FeedManager from './components/FeedManager';
import { getAllNotionEntries } from './lib/notion';

export const metadata: Metadata = {
  title: DEFAULT_SEO_CONFIG.defaultTitle,
  description: DEFAULT_SEO_CONFIG.defaultDescription,
  keywords: DEFAULT_SEO_CONFIG.keywords,
  authors: [{ name: DEFAULT_SEO_CONFIG.author }],
  openGraph: {
    title: DEFAULT_SEO_CONFIG.defaultTitle,
    description: DEFAULT_SEO_CONFIG.defaultDescription,
    url: DEFAULT_SEO_CONFIG.siteUrl,
    siteName: DEFAULT_SEO_CONFIG.siteName,
    images: DEFAULT_SEO_CONFIG.defaultImage ? [
      {
        url: DEFAULT_SEO_CONFIG.defaultImage,
        width: 1200,
        height: 630,
        alt: DEFAULT_SEO_CONFIG.defaultTitle,
      }
    ] : undefined,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_SEO_CONFIG.defaultTitle,
    description: DEFAULT_SEO_CONFIG.defaultDescription,
    images: DEFAULT_SEO_CONFIG.defaultImage ? [DEFAULT_SEO_CONFIG.defaultImage] : undefined,
    creator: DEFAULT_SEO_CONFIG.twitterHandle,
  },
  alternates: {
    canonical: DEFAULT_SEO_CONFIG.siteUrl,
  },
};

async function getEntries() {
  // 在生产环境中添加更详细的日志
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    console.log('🔍 Production environment detected');
    console.log('📋 Environment check:', {
      hasToken: !!process.env.NOTION_API_TOKEN,
      hasDbId: !!process.env.NOTION_DATABASE_ID,
      tokenPrefix: process.env.NOTION_API_TOKEN?.substring(0, 10) + '...',
    });
  }

  try {
    // 尝试从Notion获取数据
    const notionEntries = await getAllNotionEntries();
    if (notionEntries && notionEntries.length > 0) {
      console.log(`✅ Successfully fetched ${notionEntries.length} entries`);
      return notionEntries;
    } else {
      console.warn('⚠️ Notion API returned empty array');
    }
  } catch (error) {
    console.error('❌ Failed to fetch from Notion:', error);

    // 在生产环境中提供更详细的错误信息
    if (isProduction) {
      console.error('🔧 Debug info:', {
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : 'No stack trace',
        timestamp: new Date().toISOString(),
      });
    }
  }

  // 如果Notion API失败，返回空数组
  console.warn('📭 No data available from Notion API, returning empty array');
  return [];
}

export default async function Home() {
  const entries = await getEntries();

  return <FeedManager entries={entries} />;
}
