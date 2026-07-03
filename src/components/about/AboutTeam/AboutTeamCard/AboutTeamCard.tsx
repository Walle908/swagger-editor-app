import { TeamMember } from '@/types/aboutPageTypes';
import styles from './AboutTeamCard.module.scss';
import Image from 'next/image';
import { Text } from '@/components/ui';
const AboutTeamCard = ({ member }: { member: TeamMember }) => {
  return (
    <div className={styles.card}>
      <Image
        className={styles.avatar}
        src={member.image}
        alt={member.name}
        width={96}
        height={96}
      />
      <div className={styles.info}>
        <Text as="h3" weight="bold" size="md">
          {member.name}
        </Text>
        <Text weight="medium" className={styles.role}>
          {member.role}
        </Text>
        <a className={styles.github} href={member.github} rel="noopener noreferrer" target="_blank">
          GitHub
        </a>
      </div>
    </div>
  );
};

export default AboutTeamCard;
