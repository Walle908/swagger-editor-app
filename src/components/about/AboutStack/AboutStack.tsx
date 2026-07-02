import { Text } from '@/components/ui';
import styles from './AboutStack.module.scss';
import { techStack } from '@/utils/aboutUtils';
const AboutStack = () => {
  return (
    <div className={styles.aboutStack}>
      <Text as="h2" weight="bold" color="main" size="xxl">
        Tech Stack
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

export default AboutStack;
