import { Text } from '@/components/ui';
import styles from './HistoryCards.module.scss';
import { HistorySummary } from '@/types/historyTypes';
import { getCardsInfo } from '@/utils/historyUtils';

const HistoryCards = ({ summary }: { summary: HistorySummary }) => {
  const cards = getCardsInfo(summary);
  return (
    <div className={styles.grid}>
      {cards.map((x) => (
        <div key={x.label} className={styles.card}>
          <Text weight="bold" className={styles.label} font="code" color="black">
            {x.label}
          </Text>
          <div className={styles.valueRow}>
            <Text as="span" size="xl" weight="bold" className={styles.value} data-tone={x.tone}>
              {x.value}
            </Text>
            {x.unit && (
              <Text as="span" size="xs" weight="medium" color="muted" font="code">
                {x.unit}
              </Text>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryCards;
