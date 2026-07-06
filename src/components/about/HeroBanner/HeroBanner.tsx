import { Text } from '@/components/ui';
import styles from './HeroBanner.module.scss';
import { useTranslations } from 'next-intl';
export const HeroBanner = () => {
  const t = useTranslations('AboutPage');
  return (
    <section className={styles.hero}>
      <Text
        as="span"
        className={styles.eyebrow}
        color="primary"
        font="code"
        size="xxs"
        weight="medium">
        {t('eyebrow')}
      </Text>
      <Text as="h1" className={styles.title} weight="bold" color="additional" size="xxxl">
        {t('title')}
      </Text>
      <Text className={styles.description} color="muted">
        {t('description')}
      </Text>
    </section>
  );
};
