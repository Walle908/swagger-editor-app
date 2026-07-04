'use client';

import { type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import RegisterForm from '@/components/authPages/registerForm/RegisterForm';
import { Text, LinkComponent } from '@/components/ui';
import { RegisterFields } from '@/schema/authValidation';
import styles from './SignUpPage.module.scss';

export default function SignUpPage(): ReactNode {
  const t = useTranslations('Navigation');

  const handleFormSubmit = (data: RegisterFields) => {
    console.log(data);
  };

  return (
    <div className={styles.signUpContainer}>
      <div className={styles.container}>
        <Text as="h1" size="xxl">
          Create your account
        </Text>
        <RegisterForm onSubmit={handleFormSubmit} />
        <div className={styles.linkContainer}>
          <Text size="xs" color="muted">
            Already have one?
          </Text>
          <LinkComponent className={styles.link} href="/signin">
            {t('signin')}
          </LinkComponent>
        </div>
      </div>
    </div>
  );
}
