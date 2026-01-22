import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/logo.svg"
            alt="Logo"
            width={146}
            height={84}
            priority
          />
        </Link>
        <div className={styles.subtitle}>
          A collection of timeless articles.
        </div>
      </div>
    </header>
  );
}
