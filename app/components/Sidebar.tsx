'use client';

import { useEffect, useRef, useState } from 'react';
import { RSWEntry } from '../types';
import styles from './Sidebar.module.css';

interface SidebarProps {
  entries: RSWEntry[];
  activeId: number | null;
  onSelect: (id: number) => void;
}

export default function Sidebar({ entries, activeId, onSelect }: SidebarProps) {
  const navRef = useRef<HTMLElement>(null);
  const isScrollingRef = useRef(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  const handleAnnouncementClick = () => {
    setShowAnnouncement(true);
  };

  const closeAnnouncement = () => {
    setShowAnnouncement(false);
  };

  useEffect(() => {
    const navElement = navRef.current;
    if (!navElement) return;

    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = navElement;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1; // 1px tolerance
      const isAtTop = scrollTop <= 1; // 1px tolerance
      const isScrollingDown = e.deltaY > 0;
      const isScrollingUp = e.deltaY < 0;

      // If at bottom and scrolling down, jump to top
      if (isAtBottom && isScrollingDown && !isScrollingRef.current) {
        isScrollingRef.current = true;
        e.preventDefault();
        navElement.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 500);
        return;
      }

      // If at top and scrolling up, jump to bottom (optional circular scroll)
      if (isAtTop && isScrollingUp && !isScrollingRef.current) {
        isScrollingRef.current = true;
        e.preventDefault();
        navElement.scrollTo({
          top: scrollHeight,
          behavior: 'smooth',
        });
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 500);
        return;
      }
    };

    navElement.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      navElement.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <aside className={styles.sidebar} role="complementary" aria-label="文章导航">
      <div className={styles.logo}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.svg?v=3"
          alt="涌现阅览室"
          width={300}
          height={93}
        />
      </div>

      <nav
        ref={navRef}
        className={styles.nav}
        role="navigation"
        aria-label="文章列表"
      >
        {entries.map((entry, index) => (
          <button
            key={entry.id}
            onClick={() => onSelect(entry.id)}
            className={`${styles.item} ${activeId === entry.id ? styles.active : ''}`}
            aria-current={activeId === entry.id ? 'page' : undefined}
            aria-label={`文章 ${index + 1}: ${entry.title}`}
            title={entry.title}
            type="button"
          >
            {entry.title}
          </button>
        ))}
      </nav>

      {/* 公告图标 - 移到右下角 */}
      <div className={styles.announcement} onClick={handleAnnouncementClick}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/question.svg"
          alt="公告"
          className={styles.announcementIcon}
          title="点击查看公告"
        />
      </div>

      {/* 公告弹窗 */}
      {showAnnouncement && (
        <div className={styles.announcementModal} onClick={closeAnnouncement}>
          <div className={styles.announcementContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.announcementHeader}>
              <h3>📢 网站公告</h3>
              <button className={styles.closeButton} onClick={closeAnnouncement}>
                ×
              </button>
            </div>
            <div className={styles.announcementBody}>
              <p>欢迎来到涌现阅览室。</p>
              <p>在这个信息熵增的时代，我们拒绝平庸的堆砌。</p>
              <p>
                我们观察到，真正的洞见往往并不产生于单一领域的深挖，而产生于不同学科碰撞的边缘——就像神经元放电催生了意识，就像个体贸易催生了市场。这种“整体大于部分之和”的力量，我们称之为
                <strong>“涌现”</strong>
                。
              </p>
              <p>这里是为高密度灵魂准备的避风港。我们不追踪热点，我们只拆解那些能够影响未来十年的底层逻辑。</p>
              <p>在这里，阅读不是为了占有信息，而是为了完成一次认知的跃迁。</p>

              <h4>【系统之眼】</h4>
              <p>拆解复杂世界的隐形结构。</p>

              <h4>【范式转移】</h4>
              <p>捕捉技术与社会的非线性突变。</p>

              <h4>【精神装置】</h4>
              <p>在算法时代重塑人文底色。</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
