'use client';

import { type ReactNode, useState } from 'react';
import { useTranslations } from 'next-intl';
import { auth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { useRouter } from '@/i18n/navigation';
import LoginForm from '@/components/authPages/loginForm/LoginForm';
import { LoginFields } from '@/schema/authValidation';
import DecorPanel from '@/components/authPages/decorPanel/DecorPanel';
import { Text, LinkComponent } from '@/components/ui';
import styles from './SignInPage.module.scss';

export default function SignInPage(): ReactNode {
  const t = useTranslations('SignInPage');
  const router = useRouter();

  const [fbError, setFbError] = useState<string | null>(null);

  const handleFormSubmit = async (data: LoginFields) => {
    setFbError(null);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);

      router.push('/');
    } catch (error: unknown) {
      console.error('Login error Firebase:', error);

      if (
        error instanceof FirebaseError &&
        (error.code === 'auth/invalid-credential' ||
          error.code === 'auth/user-not-found' ||
          error.code === 'auth/wrong-password')
      ) {
        setFbError(t('errorInvalidCredentials'));
      } else {
        setFbError(t('errorGlobal'));
      }
    }
  };

  return (
    <div className={styles.signInContainer}>
      <DecorPanel />

      <div className={styles.contentContainer}>
        <div className={styles.textContainer}>
          <Text as="h1" size="xxl">
            {t('welcomeBack')}
          </Text>
          <Text size="sm" color="muted">
            {t('signIn')}
          </Text>
        </div>

        {fbError && (
          <div className={styles.firebaseError}>
            <Text size="sm" color="error">
              {fbError}
            </Text>
          </div>
        )}

        <LoginForm onSubmit={handleFormSubmit} />

        <div className={styles.linkContainer}>
          <Text size="xs" color="muted">
            {t('noAcc')}
          </Text>
          <LinkComponent variant="authLink" href="/signup">
            {t('signup')}
          </LinkComponent>
        </div>
      </div>
    </div>
  );
}
