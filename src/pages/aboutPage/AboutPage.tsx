import { type ReactNode } from 'react';
import styles from './AboutPage.module.scss';
import HeroBanner from '../../components/about/HeroBanner/HeroBanner';
import AboutStack from '../../components/about/AboutStack/AboutStack';
import AboutTeam from '../../components/about/AboutTeam/AboutTeam';
import AboutCourse from '../../components/about/AboutCourse/AboutCourse';

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
