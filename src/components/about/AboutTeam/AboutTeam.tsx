import { Text } from '@/components/ui';
import AboutTeamCard from './AboutTeamCard/AboutTeamCard';
import styles from './AboutTeam.module.scss';
import { teamMembers } from '@/constants/aboutInfo';
import { useTranslations } from 'next-intl';
export const AboutTeam = () => {
  const t = useTranslations('AboutPage');
  return (
    <div className={styles.aboutTeam}>
      <Text as="h2" weight="bold" size="xxl" className={styles.aboutTeamHeader}>
        {t('teamHeading')}
      </Text>
      <div className={styles.teamContainer}>
        {teamMembers.map((member) => (
          <AboutTeamCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
};
