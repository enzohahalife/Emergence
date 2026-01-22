'use client';

import { useEffect, useRef, useState } from 'react';
import { RSWEntry } from '../types';
import Sidebar from './Sidebar';
import ArticleSection from './ArticleSection';
import styles from './FeedManager.module.css';

interface FeedManagerProps {
  entries: RSWEntry[];
}

export default function FeedManager({ entries }: FeedManagerProps) {
  // Initialize activeId from URL parameter or first entry
  const getInitialActiveId = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const articleParam = urlParams.get('article');
      if (articleParam) {
        const articleId = Number(articleParam);
        // Check if the article ID exists in entries
        if (entries.some(entry => entry.id === articleId)) {
          return articleId;
        }
      }
    }
    return entries[0]?.id || null;
  };

  const [activeId, setActiveId] = useState<number | null>(null);
  const [backgroundStyle, setBackgroundStyle] = useState<string | null>(null);
  const [backgroundKey, setBackgroundKey] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);

  // Set initial activeId after component mounts
  useEffect(() => {
    setActiveId(getInitialActiveId());
  }, [entries]);

  // Update background image when activeId changes
  useEffect(() => {
    if (!activeId) {
      setBackgroundStyle(null);
      return;
    }
    const activeEntry = entries.find(entry => entry.id === activeId);
    if (activeEntry) {
      const imageUrl = activeEntry.screenshot || activeEntry.og_image;
      if (imageUrl) {
        setBackgroundStyle(`url(${imageUrl})`);
        setBackgroundKey((prev) => prev + 1);
        return;
      }
      if (activeEntry.gradient_start && activeEntry.gradient_end) {
        setBackgroundStyle(`linear-gradient(135deg, ${activeEntry.gradient_start}, ${activeEntry.gradient_end})`);
        setBackgroundKey((prev) => prev + 1);
        return;
      }
      setBackgroundStyle(null);
    }
  }, [activeId, entries]);

  // Scroll to article if specified in URL
  useEffect(() => {
    if (activeId && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const articleParam = urlParams.get('article');
      if (articleParam && Number(articleParam) === activeId) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          const element = document.getElementById(`post-${activeId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  }, [activeId]);

  // Handle intersection to update active ID and URL
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number(entry.target.id.replace('post-', ''));
            setActiveId(id);
            // Update URL shallowly
            window.history.replaceState(null, '', `?article=${id}`);
          }
        });
      },
      {
        root: mainRef.current,
        threshold: 0.5, // 50% visibility triggers update
      }
    );

    const sections = document.querySelectorAll('section[id^="post-"]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [entries]);

  // Handle Sidebar navigation
  const handleSelect = (id: number) => {
    setActiveId(id);
    const element = document.getElementById(`post-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.feedContainer}>
      <div
        key={backgroundKey}
        className={styles.backgroundImage}
        style={backgroundStyle ? { backgroundImage: backgroundStyle } : undefined}
      />
      <div className={styles.backgroundOverlay} />
      <Sidebar entries={entries} activeId={activeId} onSelect={handleSelect} />

      <main ref={mainRef} className={styles.mainScroll}>
        {entries.map((entry) => (
          <ArticleSection key={entry.id} entry={entry} />
        ))}
      </main>
    </div>
  );
}
