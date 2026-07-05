import { Text } from '@/components/ui';
import styles from './AboutStack.module.scss';
import { techStack } from '@/constants/aboutInfo';
import { useTranslations } from 'next-intl';
export const AboutStack = () => {
  const t = useTranslations('AboutPage');
  return (
    <div className={styles.aboutStack}>
      <Text as="h2" weight="bold" size="xxl">
        {t('builtWithHeading')}
      </Text>
      <ul className={styles.tags}>
        {techStack.map((tech, index) => (
          <li key={index} className={styles.tag}>
            {tech}
          </li>
        ))}
      </ul>
    </div>
  );
};
