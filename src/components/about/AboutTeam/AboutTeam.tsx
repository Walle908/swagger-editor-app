import { Text } from '@/components/ui';
import AboutTeamCard from './AboutTeamCard/AboutTeamCard';
import { teamMembers } from '@/types/aboutPageTypes';
import styles from './AboutTeam.module.scss';
const AboutTeam = () => {
  return (
    <div className={styles.aboutTeam}>
      <Text as="h2" weight="bold" color="main" size="xxl">
        Our Team
      </Text>
      <div className={styles.teamContainer}>
        {teamMembers.map((member, index) => (
          <AboutTeamCard key={index} member={member} />
        ))}
      </div>
    </div>
  );
};

export default AboutTeam;
