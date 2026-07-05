'use client';

import { type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import RegisterForm from '@/components/authPages/registerForm/RegisterForm';
import DecorPanel from '@/components/authPages/decorPanel/DecorPanel';
import { Text, LinkComponent } from '@/components/ui';
import { RegisterFields } from '@/schema/authValidation';
import styles from './SignUpPage.module.scss';

export default function SignUpPage(): ReactNode {
  const t = useTranslations('SignUpPage');

  const handleFormSubmit = (data: RegisterFields) => {
    console.log(data);
  };

  return (
    <div className={styles.signUpContainer}>
      <DecorPanel />
      <div className={styles.contentContainer}>
        <Text as="h1" size="xxl" className={styles.title}>
          {t('createAccount')}
        </Text>
        <RegisterForm onSubmit={handleFormSubmit} />
        <div className={styles.linkContainer}>
          <Text size="xs" color="muted">
            {t('alreadyHave')}
          </Text>
          <LinkComponent variant="authLink" href="/signin">
            {t('signin')}
          </LinkComponent>
        </div>
      </div>
    </div>
  );
}
