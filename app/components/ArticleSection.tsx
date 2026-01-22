import Link from 'next/link';
import { RSWEntry } from '../types';
import styles from './ArticleSection.module.css';
import { forwardRef } from 'react';
import { useMaxDistanceGradient } from '../hooks/useMaxDistanceGradient';

interface ArticleSectionProps {
  entry: RSWEntry;
}

const ArticleSection = forwardRef<HTMLDivElement, ArticleSectionProps>(({ entry }, ref) => {
  const imageUrl = entry.screenshot || entry.og_image;
  const domain = new URL(entry.url).hostname.replace('www.', '');

  // 使用最大差异颜色提取 Hook 生成背景渐变
  const { gradient, startColor, endColor, isLoading } = useMaxDistanceGradient(imageUrl);

  // 创建动态样式对象
  const sectionStyle = {
    background: gradient || 'transparent',
    backgroundAttachment: 'fixed' as const,
    backgroundSize: 'cover' as const,
    backgroundPosition: 'center' as const,
    transition: 'background 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  return (
    <section
      ref={ref}
      id={`post-${entry.id}`}
      className={styles.section}
      style={sectionStyle}
    >
      <div className={styles.articleCard}>
        <div className={styles.imageColumn}>
          {imageUrl && (
            <Link
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.imageLink}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={entry.title}
                className={styles.image}
                loading="lazy"
              />
              <div className={styles.articleInfo}>
                <h3>{entry.title}</h3>
                <p>
                  {entry.author_name && `by ${entry.author_name}`}
                  {entry.author_name && entry.publication_date && ' • '}
                  {entry.publication_date && new Date(entry.publication_date).getFullYear()}
                  {(entry.author_name || entry.publication_date) && ' • '}
                  {domain}
                </p>
              </div>
            </Link>
          )}
        </div>

        <div className={styles.infoColumn}>
          <div className={styles.content}>
            <div className={styles.metaTop}>
              <span className={styles.date}>
                {entry.publication_date ? new Date(entry.publication_date).getFullYear() : ''}
              </span>
              <span className={styles.divider}>•</span>
              <span className={styles.domain}>{domain}</span>
            </div>

            <h1 className={styles.title}>{entry.title}</h1>

            {entry.author_name && (
              <div className={styles.author}>by {entry.author_name}</div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
});

ArticleSection.displayName = 'ArticleSection';
export default ArticleSection;
