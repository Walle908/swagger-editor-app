import { Text } from '@/components/ui';
import styles from './AboutCourse.module.scss';
import { skillsList } from '@/utils/aboutUtils';
const AboutCourse = () => {
  return (
    <div className={styles.aboutCourse}>
      <Text as="h2" weight="bold" color="main" size="xxl">
        About Our Course
      </Text>
      <div className={styles.courseContent}>
        <Text as="p" weight="medium" color="main" size="md">
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
        <Text as="p" size="md">
          Ready to start?
          <a href="https://rs.school/react/" target="_blank" className={styles.buttonLink}>
            Join the course here
          </a>
        </Text>
      </div>
    </div>
  );
};

export default AboutCourse;
