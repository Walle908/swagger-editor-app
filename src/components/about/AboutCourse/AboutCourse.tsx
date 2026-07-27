import { Text } from '@/components/ui';
import styles from './AboutCourse.module.scss';
import { skillsList } from '@/constants/aboutInfo';
import { useTranslations } from 'next-intl';
export const AboutCourse = () => {
  const t = useTranslations('AboutPage.course');
  return (
    <div className={styles.aboutCourse}>
      <Text as="h2" weight="bold" size="xxl">
        {t('heading')}
      </Text>
      <div className={styles.courseContent}>
        <Text weight="medium" size="md">
          {t('intro')}
        </Text>
        <ul className={styles.courseList}>
          {skillsList.map((skill, index) => (
            <li className={styles.skillItem} key={index}>
              {skill}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.ctaWrapper}>
        <Text size="md">
          {t('ctaQuestion')}
          <a href="https://rs.school/courses/reactjs" target="_blank" className={styles.buttonLink}>
            {t('ctaLink')}
          </a>
        </Text>
      </div>
    </div>
  );
};
