import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllNotionEntries } from '../../lib/notion';
import { FALLBACK_ENTRIES } from '../../lib/fallback-data';
import { fetchNotionPageContent } from '../../lib/notion-content-fetcher';
import { fetchNotionContentByTitleFuzzy } from '../../lib/notion-title-search';
import { getArticleWithContent } from '../../lib/article-content-map';
import { generateSEOData } from '../../lib/seo';
import { RSWEntry } from '../../types';
import ArticleDetailPage from './ArticleDetailPage';

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

// 获取所有文章数据
async function getAllEntries(): Promise<RSWEntry[]> {
  try {
    const notionEntries = await getAllNotionEntries();
    if (notionEntries && notionEntries.length > 0) {
      return notionEntries;
    }
  } catch (error) {
    console.warn('Failed to fetch from Notion, using fallback data:', error);
  }
  return FALLBACK_ENTRIES;
}

// 根据ID获取特定文章并获取其内容
async function getArticleById(id: number): Promise<RSWEntry | null> {
  const entries = await getAllEntries();
  const article = entries.find(entry => entry.id === id);

  if (!article) {
    return null;
  }

  console.log(`📖 Processing article: ${article.title}`);

  // 方法1: 优先使用内容映射（临时解决方案）
  const articleWithMappedContent = getArticleWithContent(article);
  if (articleWithMappedContent.content) {
    console.log(`✅ Using mapped content for: ${article.title}`);
    return articleWithMappedContent;
  }

  // 方法2: 尝试根据文章标题查找对应的Notion页面
  let content: string | null = null;
  try {
    console.log(`🔍 Method 2: Searching by title "${article.title}"`);
    content = await fetchNotionContentByTitleFuzzy(article.title);

    if (content) {
      console.log(`✅ Successfully fetched content by title for: ${article.title}`);
      return {
        ...article,
        content: content
      };
    }
  } catch (error) {
    console.warn(`⚠️  Title-based search failed for "${article.title}":`, error);
  }

  // 方法3: 如果标题搜索失败，尝试使用原有的URL方法
  if (!content && article.url) {
    try {
      console.log(`🔍 Method 3: Using article URL ${article.url}`);
      content = await fetchNotionPageContent(article.url);

      if (content) {
        console.log(`✅ Successfully fetched content by URL for: ${article.title}`);
        return {
          ...article,
          content: content
        };
      }
    } catch (error) {
      console.warn(`⚠️  URL-based fetch failed for "${article.title}":`, error);
    }
  }

  // 方法4: 如果都失败了，返回文章但标记内容获取失败
  console.warn(`❌ No content available for article: ${article.title}`);
  return {
    ...article,
    content: null // 明确标记为null，前端可以显示相应的提示
  };
}

// 生成静态参数（用于静态生成）
export async function generateStaticParams() {
  const entries = await getAllEntries();

  return entries.map((entry) => ({
    id: entry.id.toString(),
  }));
}

// 生成动态元数据
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { id } = await params;
  const articleId = parseInt(id);

  if (isNaN(articleId)) {
    return {
      title: 'Article Not Found | Read Something Wonderful',
      description: 'The requested article could not be found.',
    };
  }

  const article = await getArticleById(articleId);

  if (!article) {
    return {
      title: 'Article Not Found | Read Something Wonderful',
      description: 'The requested article could not be found.',
    };
  }

  // 使用SEO工具生成元数据
  const seoData = generateSEOData({
    title: article.seo_title || article.title,
    description: article.seo_description || `Read "${article.title}" - A wonderful article recommended by Read Something Wonderful.`,
    keywords: article.keywords,
    image: article.og_image || article.screenshot,
    url: `/article/${article.id}`,
    author: article.author_name,
    publishedTime: article.publication_date,
    modifiedTime: null,
  });

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    authors: seoData.author ? [{ name: seoData.author }] : undefined,
    openGraph: {
      title: seoData.title,
      description: seoData.description,
      url: seoData.url,
      siteName: 'Read Something Wonderful',
      images: seoData.image ? [
        {
          url: seoData.image,
          width: 1200,
          height: 630,
          alt: seoData.title,
        }
      ] : undefined,
      locale: 'en_US',
      type: 'article',
      publishedTime: seoData.publishedTime || undefined,
      modifiedTime: seoData.modifiedTime || undefined,
      authors: seoData.author ? [seoData.author] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData.title,
      description: seoData.description,
      images: seoData.image ? [seoData.image] : undefined,
      creator: article.author_twitter_screen_name ? `@${article.author_twitter_screen_name}` : undefined,
    },
    alternates: {
      canonical: seoData.url,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const articleId = parseInt(id);

  if (isNaN(articleId)) {
    notFound();
  }

  const article = await getArticleById(articleId);
  const allEntries = await getAllEntries();

  if (!article) {
    notFound();
  }

  return <ArticleDetailPage article={article} allEntries={allEntries} />;
}