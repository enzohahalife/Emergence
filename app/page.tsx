import type { Metadata } from 'next';
import { DEFAULT_SEO_CONFIG } from './lib/seo';
import FeedManager from './components/FeedManager';
import { FALLBACK_ENTRIES } from './lib/fallback-data';
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
  try {
    // 尝试从Notion获取数据
    const notionEntries = await getAllNotionEntries();
    if (notionEntries && notionEntries.length > 0) {
      return notionEntries;
    }
  } catch (error) {
    console.warn('Failed to fetch from Notion, using fallback data:', error);
  }

  // 使用后备数据
  return FALLBACK_ENTRIES;
}

export default async function Home() {
  const entries = await getEntries();

  return <FeedManager entries={entries} />;
}
