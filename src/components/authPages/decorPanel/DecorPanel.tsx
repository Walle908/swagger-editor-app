import { type ReactNode } from 'react';
import { Logo, Text } from '@/components/ui';
import styles from './DecorPanel.module.scss';

export default function DecorPanel(): ReactNode {
  return (
    <div className={styles.container}>
      <Logo variant="additionalColor" />
      <div className={styles.textContainer}>
        <Text as="h2" color="additional" size="xl" weight="bold">
          Edit, browse & test any OpenAPI spec.
        </Text>
        <Text color="faint" size="xs">
          Sign in to save specs and keep request history.
        </Text>
      </div>
    </div>
  );
}
