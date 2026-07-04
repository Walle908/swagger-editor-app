'use client';

import { type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import LoginForm from '@/components/authPages/loginForm/LoginForm';
import { LoginFields } from '@/schema/authValidation';
import DecorPanel from '@/components/authPages/decorPanel/DecorPanel';
import { Text, LinkComponent } from '@/components/ui';
import styles from './SignInPage.module.scss';

export default function SignInPage(): ReactNode {
  const t = useTranslations('Navigation');
  const handleFormSubmit = (data: LoginFields) => {
    console.log(data);
  };

  return (
    <div className={styles.signInContainer}>
      <div className={styles.container}>
        <DecorPanel />

        <div className={styles.contentContainer}>
          <div className={styles.textContainer}>
            <Text as="h1" size="xl">
              Welcome back
            </Text>
            <Text size="xs" color="muted">
              Sign in to your account
            </Text>
          </div>

          <LoginForm onSubmit={handleFormSubmit} />

          <div className={styles.linkContainer}>
            <Text size="xs" color="muted">
              No account?
            </Text>
            <LinkComponent className={styles.link} href="/signup">
              {t('signup')}
            </LinkComponent>
          </div>
        </div>
      </div>
    </div>
  );
}
