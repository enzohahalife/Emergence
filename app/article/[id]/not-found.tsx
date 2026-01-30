import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>文章未找到</h2>
        <p className={styles.description}>
          抱歉，您访问的文章不存在或已被删除。
        </p>
        <div className={styles.actions}>
          <Link href="/" className={styles.homeButton}>
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}