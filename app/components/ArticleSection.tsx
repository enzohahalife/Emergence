import Link from 'next/link';
import Image from 'next/image';
import { RSWEntry } from '../types';
import styles from './ArticleSection.module.css';
import { forwardRef, memo, useMemo } from 'react';

interface ArticleSectionProps {
  entry: RSWEntry;
}

const ArticleSection = memo(forwardRef<HTMLDivElement, ArticleSectionProps>(function ArticleSection({ entry }, ref) {
  // 使用 useMemo 缓存计算结果
  const { imageUrl, domain, metaInfo } = useMemo(() => {
    const imageUrl = entry.screenshot || entry.og_image;
    const domain = new URL(entry.url).hostname.replace('www.', '');

    // 预计算元信息字符串
    const metaParts = [];
    if (entry.author_name) metaParts.push(`by ${entry.author_name}`);
    if (entry.publication_date) metaParts.push(new Date(entry.publication_date).getFullYear().toString());
    metaParts.push(domain);

    return {
      imageUrl,
      domain,
      metaInfo: metaParts.join(' • ')
    };
  }, [entry.screenshot, entry.og_image, entry.url, entry.author_name, entry.publication_date]);

  return (
    <section
      ref={ref}
      id={`post-${entry.id}`}
      className={styles.section}
    >
      <div className={styles.articleCard}>
        <div className={styles.imageColumn}>
          {imageUrl && (
            <Link
              href={`/article/${entry.id}`}
              className={styles.imageLink}
            >
              <Image
                src={imageUrl}
                alt={entry.title}
                width={400}
                height={300}
                className={styles.image}
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rj5m1P4Q/U4PvwP0NZUmQxcI3VhZQhgCpwQQeCDXaaV6JLiJZonWSNwGVgQQQeCDXTUqOdBBX/9k="
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
              <div className={styles.articleInfo}>
                <h3>{entry.title}</h3>
                <p>{metaInfo}</p>
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

            <Link href={`/article/${entry.id}`} className={styles.titleLink}>
              <h1 className={styles.title}>{entry.title}</h1>
            </Link>

            {entry.author_name && (
              <div className={styles.author}>by {entry.author_name}</div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}));

ArticleSection.displayName = 'ArticleSection';
export default ArticleSection;
