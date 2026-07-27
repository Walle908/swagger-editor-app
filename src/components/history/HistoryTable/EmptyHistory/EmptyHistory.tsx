import styles from './EmptyHistory.module.scss';
import clsx from 'clsx';
import { LinkComponent, Text } from '@/components/ui';
import { useTranslations } from 'next-intl';
const EmptyHistory = () => {
  const t = useTranslations('HistoryPage.empty');
  return (
    <div className={styles.empty}>
      <div className={styles.content}>
        <div className={styles.icon} aria-hidden>
          -
        </div>
        <Text as="h2" size="xl" weight="bold" className={styles.title}>
          {t('title')}
        </Text>
        <Text size="md" color="secondary" className={styles.text}>
          {t('text')}
        </Text>
      </div>
      <div className={styles.actions}>
        <LinkComponent href="/" variant="buttonLink" className={clsx('colorfull', styles.btn)}>
          {t('openEditor')}
        </LinkComponent>
        <LinkComponent href="/" variant="buttonLink" className={clsx('buttonLink', styles.btn)}>
          {t('browseViewer')}
        </LinkComponent>
      </div>
    </div>
  );
};

export default EmptyHistory;
