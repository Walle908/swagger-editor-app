import { TeamMember } from '@/types/aboutPageTypes';
import styles from './AboutTeamCard.module.scss';
import Image from 'next/image';
import { Text } from '@/components/ui';
import { useTranslations } from 'next-intl';
const AboutTeamCard = ({ member }: { member: TeamMember }) => {
  const t = useTranslations('AboutPage');
  const name = t(`members.member${member.id}`);
  const role = t(`roles.role${member.id}`);
  return (
    <div className={styles.card}>
      <Image className={styles.avatar} src={member.image} alt={name} width={96} height={96} />
      <div className={styles.info}>
        <Text as="h3" weight="bold" size="md">
          {name}
        </Text>
        <Text weight="medium" className={styles.role}>
          {role}
        </Text>
        <a className={styles.github} href={member.github} rel="noopener noreferrer" target="_blank">
          GitHub
        </a>
      </div>
    </div>
  );
};

export default AboutTeamCard;
