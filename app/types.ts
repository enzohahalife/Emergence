// 原有的 RSWEntry 接口（向后兼容）
export interface RSWEntry {
    id: number;
    url: string;
    title: string;
    screenshot: string | null;
    og_image: string | null;
    publication_date: string | null;
    author_name: string | null;
    author_twitter_screen_name: string | null;
    recommender_name: string | null;
    recommender_twitter_screen_name: string | null;
    gradient_start: string | null; // Hex color
    gradient_end: string | null;   // Hex color
}

// 新的增强型文章接口
export interface EnhancedArticle {
    // 基础信息
    id: number;
    title: string;
    url: string;
    status: 'Published' | 'Draft' | 'Archived' | 'Review';
    category: string[];

    // 作者信息
    author_name: string | null;
    author_twitter: string | null;
    author_bio: string | null;

    // 推荐信息
    recommender_name: string | null;
    recommender_twitter: string | null;
    recommendation: string | null;

    // 时间字段
    publication_date: string | null;
    added_date: string;
    last_modified: string;

    // 媒体资源
    featured_image: string | null;
    screenshot: string | null;
    og_image: string | null;

    // 视觉设计
    primary_color: string | null;
    secondary_color: string | null;
    theme: 'Dark' | 'Light' | 'Colorful' | 'Minimal' | null;

    // SEO 专用
    seo_title: string | null;
    seo_description: string | null;
    keywords: string[];
    reading_time: number | null;

    // 统计字段
    views: number | null;
    clicks: number | null;
    quality_score: number | null;
}

// API 响应接口
export interface APIResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: RSWEntry[];
}

// Notion API 响应接口
export interface NotionAPIResponse {
    results: any[];
    next_cursor: string | null;
    has_more: boolean;
}

// 字段映射配置接口
export interface FieldMapping {
    [key: string]: string;
}

// SEO 配置接口
export interface SEOData {
    title: string;
    description: string;
    keywords: string[];
    image: string | null;
    url: string;
    author: string | null;
    publishedTime: string | null;
    modifiedTime: string | null;
}

// 转换函数：将 EnhancedArticle 转换为 RSWEntry（向后兼容）
export function enhancedToLegacy(enhanced: EnhancedArticle): RSWEntry {
    return {
        id: enhanced.id,
        url: enhanced.url,
        title: enhanced.title,
        screenshot: enhanced.screenshot,
        og_image: enhanced.og_image || enhanced.featured_image,
        publication_date: enhanced.publication_date,
        author_name: enhanced.author_name,
        author_twitter_screen_name: enhanced.author_twitter,
        recommender_name: enhanced.recommender_name,
        recommender_twitter_screen_name: enhanced.recommender_twitter,
        gradient_start: enhanced.primary_color,
        gradient_end: enhanced.secondary_color,
    };
}

// 转换函数：将 RSWEntry 转换为 EnhancedArticle
export function legacyToEnhanced(legacy: RSWEntry): EnhancedArticle {
    return {
        // 基础信息
        id: legacy.id,
        title: legacy.title,
        url: legacy.url,
        status: 'Published',
        category: [],

        // 作者信息
        author_name: legacy.author_name,
        author_twitter: legacy.author_twitter_screen_name,
        author_bio: null,

        // 推荐信息
        recommender_name: legacy.recommender_name,
        recommender_twitter: legacy.recommender_twitter_screen_name,
        recommendation: null,

        // 时间字段
        publication_date: legacy.publication_date,
        added_date: new Date().toISOString(),
        last_modified: new Date().toISOString(),

        // 媒体资源
        featured_image: legacy.og_image,
        screenshot: legacy.screenshot,
        og_image: legacy.og_image,

        // 视觉设计
        primary_color: legacy.gradient_start,
        secondary_color: legacy.gradient_end,
        theme: null,

        // SEO 专用
        seo_title: null,
        seo_description: null,
        keywords: [],
        reading_time: null,

        // 统计字段
        views: null,
        clicks: null,
        quality_score: null,
    };
}
