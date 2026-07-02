import { Text } from '@/components/ui';
import styles from './HeroBanner.module.scss';
const HeroBanner = () => {
  return (
    <section className={styles.hero}>
      <Text as="span" className={styles.eyebrow}>
        RS SCHOOL | REACT COURSE | FINAL TASK
      </Text>
      <Text as="h1" className={styles.title}>
        An OpenAPI editor & REST client, built as a team
      </Text>
      <Text as="p" className={styles.description}>
        OpenAPI Studio lets you paste any OpenAPI / Swagger spec, browse its endpoints, and execute
        live requests through an SSR proxy — no CORS headaches. Built with a modern SSR React
        framework, TypeScript, i18n and full test coverage.
      </Text>
    </section>
  );
};

export default HeroBanner;
