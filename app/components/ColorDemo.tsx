'use client';

import { useState, useEffect } from 'react';
import { useSimpleImageColorGradient } from '../hooks/useSimpleImageColorGradient';
import styles from './ColorDemo.module.css';

// 示例图片数据
const sampleImages = [
  {
    id: 1,
    title: "蓝色海洋",
    url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop",
    description: "深蓝色海洋景观"
  },
  {
    id: 2,
    title: "橙色日落",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    description: "温暖的橙色日落"
  },
  {
    id: 3,
    title: "绿色森林",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    description: "清新的绿色森林"
  },
  {
    id: 4,
    title: "紫色薰衣草",
    url: "https://images.unsplash.com/photo-1498307833015-e7b400441eb8?w=800&h=600&fit=crop",
    description: "浪漫的紫色薰衣草田"
  }
];

export default function ColorDemo() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const currentImage = sampleImages[currentImageIndex];

  // 使用简化版颜色提取 Hook
  const { gradient, startColor, endColor, isLoading, error } = useSimpleImageColorGradient(currentImage.url);

  // 自动切换图片（可选）
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % sampleImages.length);
    }, 8000); // 每8秒切换一次

    return () => clearInterval(interval);
  }, []);

  const sectionStyle = {
    background: gradient || 'linear-gradient(135deg, rgba(30,30,30,0.9) 0%, rgba(10,10,10,0.9) 100%)',
    transition: 'background 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  return (
    <div className={styles.container} style={sectionStyle}>
      <div className={styles.content}>
        <h1 className={styles.title}>动态背景颜色演示</h1>
        <p className={styles.subtitle}>背景会根据图片的主色调自动生成渐变</p>

        <div className={styles.imageContainer}>
          <img
            src={currentImage.url}
            alt={currentImage.title}
            className={styles.image}
          />
          <div className={styles.imageInfo}>
            <h3>{currentImage.title}</h3>
            <p>{currentImage.description}</p>
          </div>
        </div>

        <div className={styles.controls}>
          <div className={styles.imageSelector}>
            {sampleImages.map((image, index) => (
              <button
                key={image.id}
                className={`${styles.imageButton} ${index === currentImageIndex ? styles.active : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <img src={image.url} alt={image.title} />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.colorInfo}>
          <div className={styles.colorDisplay}>
            <div className={styles.colorSwatch}>
              <div
                className={styles.colorBox}
                style={{ backgroundColor: startColor }}
              ></div>
              <span>起始色: {startColor}</span>
            </div>
            <div className={styles.colorSwatch}>
              <div
                className={styles.colorBox}
                style={{ backgroundColor: endColor }}
              ></div>
              <span>结束色: {endColor}</span>
            </div>
          </div>

          {isLoading && <p className={styles.status}>正在提取颜色...</p>}
          {error && <p className={styles.error}>颜色提取失败: {error}</p>}
        </div>
      </div>
    </div>
  );
}