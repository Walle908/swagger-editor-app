'use client';

import { type ReactNode } from 'react';
import styles from './AboutPage.module.scss';
import { HeroBanner, AboutStack, AboutTeam, AboutCourse } from '@/components/about';
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
