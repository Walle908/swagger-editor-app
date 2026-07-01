import { Text } from '@/components/ui';
import { getCardsInfo } from './getCardInfo';
import styles from './HistoryCards.module.scss';
import { HistorySummary } from '@/types/historyTypes';

const HistoryCards = ({ summary }: { summary: HistorySummary }) => {
  const cards = getCardsInfo(summary);
  return (
    <div className={styles.grid}>
      {cards.map((x) => (
        <div key={x.label} className={styles.card}>
          <Text weight="bold" className={styles.label}>
            {x.label}
          </Text>
          <div className={styles.valueRow}>
            <Text as="span" weight="bold" className={styles.value} data-tone={x.tone}>
              {x.value}
            </Text>
            {x.unit && (
              <Text as="span" size="xs" weight="medium" color="muted" className={styles.unit}>
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
