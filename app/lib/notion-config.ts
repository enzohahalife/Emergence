// 前端匹配版 Notion 数据库字段映射（最推荐）
export const FRONTEND_MATCHED_MAPPING = {
  // 前端必需字段（完全匹配）
  title: 'Title',        // → entry.title
  url: 'URL',            // → entry.url
  id: 'ID',              // → entry.id
  author: 'Author',      // → entry.author_name
  date: 'Date',          // → entry.publication_date
  image: 'Image',        // → entry.screenshot & entry.og_image
  content: 'notion-page-content',    // → entry.content

  // SEO 字段
  seoTitle: 'SEO Title',              // → entry.seo_title
  seoDescription: 'SEO Description', // → entry.seo_description
  keywords: 'Keywords',               // → entry.keywords
};

// 精简版 Notion 数据库字段映射（备用）
export const SIMPLE_NOTION_FIELD_MAPPING = {
  // 核心必需字段
  title: 'Title',                    // Title property
  url: 'URL',                        // URL property
  id: 'ID',                          // Number property
  author: 'Author',                  // Rich text property
  publicationDate: 'Publication Date', // Date property
  featuredImage: 'Featured Image',   // Files & media property

  // SEO 增强字段
  status: 'Status',                  // Select property
  seoDescription: 'SEO Description', // Rich text property
  category: 'Category',              // Multi-select property
  recommender: 'Recommender',        // Rich text property

  // 自动字段
  created: 'Created',                // Created time property
  updated: 'Updated',                // Last edited time property
};

// 完整版数据库字段映射（高级用户）
export const FULL_NOTION_FIELD_MAPPING = {
  // 基础信息
  title: 'Title',                    // Title property
  url: 'URL',                        // URL property
  id: 'ID',                          // Number property
  status: 'Status',                  // Select property

  // 作者信息
  author: 'Author Name',             // Rich text property
  authorTwitter: 'Author Twitter',   // Rich text property
  authorBio: 'Author Bio',           // Rich text property

  // 推荐信息
  recommender: 'Recommender',        // Rich text property
  recommenderTwitter: 'Recommender Twitter', // Rich text property
  recommendation: 'Recommendation',   // Rich text property

  // 时间字段
  publicationDate: 'Publication Date', // Date property
  addedDate: 'Added Date',           // Created time property
  lastModified: 'Last Modified',     // Last edited time property

  // 媒体资源
  featuredImage: 'Featured Image',   // Files & media property
  screenshot: 'Screenshot',          // Files & media property
  ogImage: 'OG Image',              // URL property

  // 视觉设计
  primaryColor: 'Primary Color',     // Rich text property (HEX)
  secondaryColor: 'Secondary Color', // Rich text property (HEX)
  theme: 'Theme',                    // Select property

  // SEO 专用
  seoTitle: 'SEO Title',            // Rich text property
  seoDescription: 'SEO Description', // Rich text property
  keywords: 'Keywords',             // Multi-select property
  readingTime: 'Reading Time',      // Number property

  // 统计字段
  views: 'Views',                   // Number property
  clicks: 'Clicks',                 // Number property
  qualityScore: 'Quality Score',    // Number property

  // 分类
  category: 'Category',             // Multi-select property
};

// 原有字段映射（向后兼容）
export const LEGACY_NOTION_FIELD_MAPPING = {
  title: 'Title',
  url: 'URL',
  id: 'ID',
  author: 'Author',
  authorTwitter: 'Author Twitter',
  recommender: 'Recommender',
  recommenderTwitter: 'Recommender Twitter',
  publicationDate: 'Publication Date',
  screenshot: 'Screenshot',
  ogImage: 'OG Image',
  gradientStart: 'Gradient Start',
  gradientEnd: 'Gradient End',
};

// 字段映射选项
export const FIELD_MAPPING_OPTIONS = {
  matched: FRONTEND_MATCHED_MAPPING,       // 🎯 推荐：前端匹配版
  simple: SIMPLE_NOTION_FIELD_MAPPING,    // 📊 备用：精简版
  full: FULL_NOTION_FIELD_MAPPING,        // 🔧 高级：完整版
  legacy: LEGACY_NOTION_FIELD_MAPPING,    // 🔄 兼容：旧版
};

// 默认使用前端匹配版字段映射
export const DEFAULT_FIELD_MAPPING = FRONTEND_MATCHED_MAPPING;

// 状态选项映射
export const STATUS_OPTIONS = {
  PUBLISHED: 'Published',
  DRAFT: 'Draft',
  HIDDEN: 'Hidden',
};

// 分类选项映射（精简版）
export const SIMPLE_CATEGORY_OPTIONS = {
  TECH: 'Tech',
  DESIGN: 'Design',
  BUSINESS: 'Business',
  LEARNING: 'Learning',
  THINKING: 'Thinking',
  TOOLS: 'Tools',
};

// 分类选项映射（完整版）
export const FULL_CATEGORY_OPTIONS = {
  TECHNOLOGY: 'Technology',
  DESIGN: 'Design',
  BUSINESS: 'Business',
  EDUCATION: 'Education',
  PSYCHOLOGY: 'Psychology',
  PRODUCTIVITY: 'Productivity',
  CULTURE: 'Culture',
  SCIENCE: 'Science',
};

// 主题选项映射
export const THEME_OPTIONS = {
  DARK: 'Dark',
  LIGHT: 'Light',
  COLORFUL: 'Colorful',
  MINIMAL: 'Minimal',
};