import { Text } from '@/components/ui';
import styles from './AboutCourse.module.scss';
import { skillsList } from '@/constants/aboutInfo';
export const AboutCourse = () => {
  return (
    <div className={styles.aboutCourse}>
      <Text as="h2" weight="bold" size="xxl">
        About Our Course
      </Text>
      <div className={styles.courseContent}>
        <Text weight="medium" size="md">
          This course is aimed at the students of the RS School who have passed RS School Stage #2
          and at the new students who have experience with:
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
          Ready to start?
          <a href="https://rs.school/react/" target="_blank" className={styles.buttonLink}>
            Join the course here
          </a>
        </Text>
      </div>
    </div>
  );
};
