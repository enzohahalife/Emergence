'use client';

import { useEffect, useState } from 'react';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  delay?: number; // 延迟显示时间（毫秒）
  message?: string;
}

export default function LoadingSpinner({
  delay = 500,
  message = "正在加载精彩内容..."
}: LoadingSpinnerProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.spinner}>
          <div className={styles.dot1}></div>
          <div className={styles.dot2}></div>
          <div className={styles.dot3}></div>
        </div>
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
}