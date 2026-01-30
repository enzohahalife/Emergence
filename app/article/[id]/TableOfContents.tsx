'use client';

import { useEffect, useState } from 'react';
import styles from './TableOfContents.module.css';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  // 从 Markdown 内容中提取标题
  useEffect(() => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const items: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s\u4e00-\u9fff]/g, '') // 保留中文字符
        .replace(/\s+/g, '-')
        .substring(0, 50); // 限制长度

      items.push({ id, text, level });
    }

    setTocItems(items);
  }, [content]);

  // 监听滚动，更新当前活跃的标题
  useEffect(() => {
    if (tocItems.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0,
      }
    );

    // 观察所有标题元素
    tocItems.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [tocItems]);

  // 点击目录项滚动到对应位置
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  // 如果没有标题，不显示目录
  if (tocItems.length === 0) {
    return null;
  }

  return (
    <div className={styles.tocContainer}>
      <div className={styles.tocHeader}>
        <h3>📋 文章目录</h3>
      </div>

      <nav className={styles.tocNav}>
        <ul className={styles.tocList}>
          {tocItems.map((item) => (
            <li
              key={item.id}
              className={`${styles.tocItem} ${styles[`level${item.level}`]} ${
                activeId === item.id ? styles.active : ''
              }`}
            >
              <button
                className={styles.tocLink}
                onClick={() => scrollToHeading(item.id)}
                title={item.text}
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* 阅读进度条 */}
      <div className={styles.progressContainer}>
        <div className={styles.progressLabel}>阅读进度</div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${Math.min(
                100,
                Math.max(0, (tocItems.findIndex(item => item.id === activeId) + 1) / tocItems.length * 100)
              )}%`
            }}
          />
        </div>
      </div>
    </div>
  );
}