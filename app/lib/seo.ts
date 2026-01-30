import { RSWEntry } from '../types';

// SEO 配置接口
export interface SEOConfig {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultImage: string;
  twitterHandle?: string;
  author: string;
  keywords: string[];
}

// 单篇文章的 SEO 数据
export interface ArticleSEO {
  title: string;
  description: string;
  url: string;
  image?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  keywords: string[];
  type: 'article' | 'website';
}

// 默认 SEO 配置
export const DEFAULT_SEO_CONFIG: SEOConfig = {
  siteName: '涌现阅览室',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com', // 从环境变量读取，或使用默认值
  defaultTitle: '涌现阅览室',
  defaultDescription: '知识止步于此，行动始于涌现',
  defaultImage: '/og-image.jpg', // 请添加默认的 OG 图片
  twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@your_twitter', // 从环境变量读取
  author: '涌现阅览室',
  keywords: ['涌现阅览室', '涌现', 'yxlab', '阅览室'],
};

// 从 RSWEntry 生成 SEO 数据
export function generateArticleSEO(entry: RSWEntry, config: SEOConfig = DEFAULT_SEO_CONFIG): ArticleSEO {
  // 优先使用 Notion 中的 SEO 字段，如果没有则自动生成
  const title = entry.seo_title 
    ? `${entry.seo_title} | ${config.siteName}`
    : `${entry.title} | ${config.siteName}`;

  const description = entry.seo_description || generateDescription(entry, config);

  // 合并 Notion 中的关键词和自动生成的关键词
  const notionKeywords = entry.keywords || [];
  const autoKeywords = generateKeywords(entry, config);
  const keywords = [...new Set([...notionKeywords, ...autoKeywords])];

  // 生成完整 URL
  const url = `${config.siteUrl}/article/${entry.id}`;

  return {
    title,
    description,
    url,
    image: entry.og_image || entry.screenshot || config.defaultImage,
    author: entry.author_name || config.author,
    publishedTime: entry.publication_date || undefined,
    modifiedTime: new Date().toISOString(),
    keywords,
    type: 'article',
  };
}

// 生成文章描述
function generateDescription(entry: RSWEntry, config: SEOConfig): string {
  const parts = [];

  if (entry.author_name) {
    parts.push(`由 ${entry.author_name} 撰写`);
  }

  if (entry.recommender_name) {
    parts.push(`${entry.recommender_name} 推荐`);
  }

  const description = parts.length > 0
    ? `${entry.title} - ${parts.join('，')}。在 ${config.siteName} 发现更多精彩内容。`
    : `${entry.title} - ${config.defaultDescription}`;

  // 限制描述长度（SEO 最佳实践：150-160 字符）
  return description.length > 160
    ? description.substring(0, 157) + '...'
    : description;
}

// 生成关键词
function generateKeywords(entry: RSWEntry, config: SEOConfig): string[] {
  const keywords = [...config.keywords];

  // 从标题中提取关键词
  const titleWords = entry.title
    .split(/[\s\-_,，。！？]+/)
    .filter(word => word.length > 1)
    .slice(0, 5);

  keywords.push(...titleWords);

  // 添加作者相关关键词
  if (entry.author_name) {
    keywords.push(entry.author_name);
  }

  // 去重并返回
  return [...new Set(keywords)];
}

// 生成首页 SEO 数据
export function generateHomeSEO(entries: RSWEntry[], config: SEOConfig = DEFAULT_SEO_CONFIG): ArticleSEO {
  const latestArticles = entries.slice(0, 3).map(entry => entry.title);
  const description = latestArticles.length > 0
    ? `最新推荐：${latestArticles.join('、')}。${config.defaultDescription}`
    : config.defaultDescription;

  return {
    title: config.defaultTitle,
    description,
    url: config.siteUrl,
    image: config.defaultImage,
    author: config.author,
    publishedTime: new Date().toISOString(),
    modifiedTime: new Date().toISOString(),
    keywords: config.keywords,
    type: 'website',
  };
}

// 生成结构化数据 (JSON-LD)
export function generateStructuredData(seo: ArticleSEO, config: SEOConfig = DEFAULT_SEO_CONFIG) {
  if (seo.type === 'article') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: seo.title,
      description: seo.description,
      image: seo.image,
      author: {
        '@type': 'Person',
        name: seo.author || config.author,
      },
      publisher: {
        '@type': 'Organization',
        name: config.siteName,
        logo: {
          '@type': 'ImageObject',
          url: `${config.siteUrl}/logo.svg`,
        },
      },
      datePublished: seo.publishedTime,
      dateModified: seo.modifiedTime,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': seo.url,
      },
    };
  } else {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: config.siteName,
      description: seo.description,
      url: config.siteUrl,
      author: {
        '@type': 'Organization',
        name: config.author,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${config.siteUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    };
  }
}

// 为动态路由页面生成SEO数据（简化版本）
export function generateSEOData(data: {
  title: string;
  description: string;
  keywords: string[];
  image: string | null;
  url: string;
  author: string | null;
  publishedTime: string | null;
  modifiedTime: string | null;
}, config: SEOConfig = DEFAULT_SEO_CONFIG) {
  return {
    title: data.title.includes(config.siteName) ? data.title : `${data.title} | ${config.siteName}`,
    description: data.description,
    keywords: data.keywords,
    image: data.image || config.defaultImage,
    url: data.url.startsWith('http') ? data.url : `${config.siteUrl}${data.url}`,
    author: data.author || config.author,
    publishedTime: data.publishedTime,
    modifiedTime: data.modifiedTime,
  };
}

// 生成 sitemap 数据
export function generateSitemapData(entries: RSWEntry[], config: SEOConfig = DEFAULT_SEO_CONFIG) {
  const urls = [
    {
      url: config.siteUrl,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0,
    },
  ];

  entries.forEach(entry => {
    urls.push({
      url: `${config.siteUrl}/article/${entry.id}`,
      lastmod: entry.publication_date || new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.8,
    });
  });

  return urls;
}