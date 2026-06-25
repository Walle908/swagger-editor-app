import Link from 'next/link';
import Text from '@/components/ui/text/Text';
import styles from './page.module.scss';

export default function HomePage() {
  return (
    <div className={styles.pageWrapper}>
      {' '}
      <Text as="h1" color="accent" size="xl">
        Main Page
      </Text>
      <Link href="/about">About us</Link>
      <Link href="/signup">Sign up</Link>
      <Link href="/signin">Sign in</Link>
    </div>
  );
}
