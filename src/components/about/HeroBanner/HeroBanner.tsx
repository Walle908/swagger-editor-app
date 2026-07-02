import { Text } from '@/components/ui';
import styles from './HeroBanner.module.scss';
export const HeroBanner = () => {
  return (
    <section className={styles.hero}>
      <Text
        as="span"
        className={styles.eyebrow}
        color="primary"
        font="code"
        size="xxs"
        weight="medium">
        RS SCHOOL | REACT COURSE | FINAL TASK
      </Text>
      <Text as="h1" className={styles.title} weight="bold" color="additional" size="xxxl">
        An OpenAPI editor & REST client, built as a team
      </Text>
      <Text className={styles.description} color="muted">
        OpenAPI Studio lets you paste any OpenAPI / Swagger spec, browse its endpoints, and execute
        live requests through an SSR proxy — no CORS headaches. Built with a modern SSR React
        framework, TypeScript, i18n and full test coverage.
      </Text>
    </section>
  );
};
