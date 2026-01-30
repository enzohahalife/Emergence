'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github.css'; // 代码高亮样式
import { RSWEntry } from '../../types';
import TableOfContents from './TableOfContents';
import styles from './ArticleDetailPage.module.css';

interface ArticleDetailPageProps {
  article: RSWEntry;
  allEntries: RSWEntry[];
}

export default function ArticleDetailPage({ article, allEntries }: ArticleDetailPageProps) {
  // 获取上一篇和下一篇文章
  const currentIndex = allEntries.findIndex(entry => entry.id === article.id);
  const prevArticle = currentIndex > 0 ? allEntries[currentIndex - 1] : null;
  const nextArticle = currentIndex < allEntries.length - 1 ? allEntries[currentIndex + 1] : null;

  // 生成标题 ID 的辅助函数
  const generateHeadingId = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fff]/g, '') // 保留中文字符
      .replace(/\s+/g, '-')
      .substring(0, 50); // 限制长度
  };
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 只在没有输入框聚焦时处理键盘事件
      if (document.activeElement?.tagName === 'INPUT' ||
          document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
        case 'h': // Vim-style navigation
          event.preventDefault();
          if (prevArticle) {
            window.location.href = `/article/${prevArticle.id}`;
          }
          break;
        case 'ArrowRight':
        case 'l': // Vim-style navigation
          event.preventDefault();
          if (nextArticle) {
            window.location.href = `/article/${nextArticle.id}`;
          }
          break;
        case 't':
        case 'T': // 切换目录 - 现在目录直接显示，这个功能可以移除
          event.preventDefault();
          // 目录现在直接显示，不需要切换
          break;
        case 'Escape':
          event.preventDefault();
          window.location.href = '/';
          break;
        case 'Home':
          event.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;
        case 'End':
          event.preventDefault();
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevArticle, nextArticle]);

  return (
    <div className={styles.container}>
      {/* 文章目录 */}
      {article.content && <TableOfContents content={article.content} />}

      {/* 导航栏 */}
      <nav className={styles.navigation}>
        <Link href="/" className={styles.backLink}>
          ← 返回首页
        </Link>
        <div className={styles.navControls}>
          {prevArticle && (
            <Link href={`/article/${prevArticle.id}`} className={styles.navLink}>
              ← 上一篇
            </Link>
          )}
          {nextArticle && (
            <Link href={`/article/${nextArticle.id}`} className={styles.navLink}>
              下一篇 →
            </Link>
          )}
        </div>
      </nav>

      {/* 键盘快捷键提示 */}
      <div className={styles.keyboardHints}>
        <div className={styles.hint}>
          <kbd>←</kbd> / <kbd>H</kbd> 上一篇
        </div>
        <div className={styles.hint}>
          <kbd>→</kbd> / <kbd>L</kbd> 下一篇
        </div>
        <div className={styles.hint}>
          <kbd>Esc</kbd> 返回首页
        </div>
        <div className={styles.hint}>
          <kbd>Home</kbd> / <kbd>End</kbd> 页面顶部/底部
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className={styles.contentWrapper}>
        {/* 文章目录 */}
        {article.content && <TableOfContents content={article.content} />}

        {/* 主要内容 */}
        <main className={styles.main}>
        <article className={styles.article}>
          {/* 文章头部 */}
          <header className={styles.header}>
            <h1 className={styles.title}>{article.title}</h1>

            <div className={styles.meta}>
              {article.author_name && (
                <div className={styles.author}>
                  <span>作者: {article.author_name}</span>
                </div>
              )}

              {article.publication_date && (
                <div className={styles.date}>
                  发布时间: {new Date(article.publication_date).toLocaleDateString('zh-CN')}
                </div>
              )}
            </div>
          </header>

          {/* 文章内容 */}
          <div className={styles.content}>
            {article.content ? (
              <div className={styles.articleContent}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  components={{
                    // 自定义组件样式
                    h1: ({ children }) => {
                      const text = children?.toString() || '';
                      const id = generateHeadingId(text);
                      return (
                        <h1 id={id} className={styles.heading1}>
                          {children}
                        </h1>
                      );
                    },
                    h2: ({ children }) => {
                      const text = children?.toString() || '';
                      const id = generateHeadingId(text);
                      return (
                        <h2 id={id} className={styles.heading2}>
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children }) => {
                      const text = children?.toString() || '';
                      const id = generateHeadingId(text);
                      return (
                        <h3 id={id} className={styles.heading3}>
                          {children}
                        </h3>
                      );
                    },
                    h4: ({ children }) => {
                      const text = children?.toString() || '';
                      const id = generateHeadingId(text);
                      return (
                        <h4 id={id} className={styles.heading4}>
                          {children}
                        </h4>
                      );
                    },
                    h5: ({ children }) => {
                      const text = children?.toString() || '';
                      const id = generateHeadingId(text);
                      return (
                        <h5 id={id} className={styles.heading5}>
                          {children}
                        </h5>
                      );
                    },
                    h6: ({ children }) => {
                      const text = children?.toString() || '';
                      const id = generateHeadingId(text);
                      return (
                        <h6 id={id} className={styles.heading6}>
                          {children}
                        </h6>
                      );
                    },
                    p: ({ children }) => (
                      <p className={styles.paragraph}>{children}</p>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className={styles.blockquote}>{children}</blockquote>
                    ),
                    ul: ({ children }) => (
                      <ul className={styles.list}>{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className={styles.list}>{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className={styles.listItem}>{children}</li>
                    ),
                    code: ({ className, children, ...props }: any) => {
                      const match = /language-(\w+)/.exec(className || '');
                      const isInline = !match;

                      if (isInline) {
                        return <code className={styles.inlineCode} {...props}>{children}</code>;
                      }
                      return (
                        <pre className={styles.codeBlock}>
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      );
                    },
                    pre: ({ children }) => (
                      <div className={styles.codeBlock}>{children}</div>
                    ),
                    hr: () => <hr className={styles.divider} />,
                    strong: ({ children }) => (
                      <strong className={styles.strong}>{children}</strong>
                    ),
                    em: ({ children }) => (
                      <em className={styles.emphasis}>{children}</em>
                    ),
                    del: ({ children }) => (
                      <del className={styles.strikethrough}>{children}</del>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        className={styles.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                    img: ({ src, alt, title }) => (
                      <div className={styles.imageContainer}>
                        <img
                          src={src}
                          alt={alt || '图片'}
                          title={title}
                          className={styles.image}
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            // 创建错误提示元素
                            const errorDiv = document.createElement('div');
                            errorDiv.className = styles.imageError || 'image-error';
                            errorDiv.innerHTML = `
                              <div style="
                                padding: 2rem;
                                border: 2px dashed #ddd;
                                border-radius: 8px;
                                text-align: center;
                                color: #666;
                                background: #f9f9f9;
                              ">
                                <div style="font-size: 2rem; margin-bottom: 0.5rem;">🖼️</div>
                                <div>图片加载失败</div>
                                <div style="font-size: 0.8rem; margin-top: 0.5rem; color: #999;">
                                  ${alt || '无法显示图片'}
                                </div>
                              </div>
                            `;
                            target.parentNode?.insertBefore(errorDiv, target);
                          }}
                        />
                        {title && (
                          <div className={styles.imageCaption}>{title}</div>
                        )}
                      </div>
                    ),
                    table: ({ children }) => (
                      <div className={styles.tableWrapper}>
                        <table className={styles.table}>{children}</table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className={styles.tableHeader}>{children}</th>
                    ),
                    td: ({ children }) => (
                      <td className={styles.tableCell}>{children}</td>
                    ),
                  }}
                >
                  {article.content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className={styles.noContent}>
                <p>📝 文章内容暂未同步</p>
                <p>内容正在从 Notion 数据库加载中，请稍后刷新页面查看。</p>
                {article.url && (
                  <p>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.originalLink}
                    >
                      📖 查看原文
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>
        </article>
      </main>
      </div>
    </div>
  );
}