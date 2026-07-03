import styles from './EmptyHistory.module.scss';
import clsx from 'clsx';
import { LinkComponent, Text } from '@/components/ui';
const EmptyHistory = () => {
  return (
    <div className={styles.empty}>
      <div className={styles.content}>
        <div className={styles.icon} aria-hidden>
          -
        </div>
        <Text as="h2" size="xl" weight="bold" className={styles.title}>
          No requests yet
        </Text>
        <Text size="md" color="secondary" className={styles.text}>
          You haven&apos;t executed any requests. Try an endpoint to see analytics here.
        </Text>
      </div>
      <div className={styles.actions}>
        <LinkComponent href="/" variant="buttonLink" className={clsx('colorfull', styles.btn)}>
          Open Editor
        </LinkComponent>
        <LinkComponent href="/" variant="buttonLink" className={clsx('buttonLink', styles.btn)}>
          Viewer
        </LinkComponent>
      </div>
    </div>
  );
};

export default EmptyHistory;
