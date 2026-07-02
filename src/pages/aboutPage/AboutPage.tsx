import { type ReactNode } from 'react';
import styles from './AboutPage.module.scss';
import HeroBanner from './HeroBanner/HeroBanner';
import AboutStack from './AboutStack/AboutStack';
import AboutTeam from './AboutTeam/AboutTeam';
import AboutCourse from './AboutCourse/AboutCourse';

export default function AboutPage(): ReactNode {
  return (
    <div className={styles.aboutContainer}>
      <HeroBanner />
      <div className={styles.contentContainer}>
        <AboutTeam />
        <AboutStack />
        <AboutCourse />
      </div>
    </div>
  );
}
