'use client';

import { type ReactNode, useState } from 'react';
import { useTranslations } from 'next-intl';
import { auth } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useRouter } from '@/i18n/navigation';
import { FirebaseError } from 'firebase/app';
import RegisterForm from '@/components/authPages/registerForm/RegisterForm';
import DecorPanel from '@/components/authPages/decorPanel/DecorPanel';
import { Text, LinkComponent } from '@/components/ui';
import { RegisterFields } from '@/schema/authValidation';
import styles from './SignUpPage.module.scss';

export default function SignUpPage(): ReactNode {
  const t = useTranslations('SignUpPage');
  const router = useRouter();

  const [fbError, setFbError] = useState<string | null>(null);

  const handleFormSubmit = async (data: RegisterFields) => {
    setFbError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);

      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: data.name,
        });
      }

      await userCredential.user.getIdToken(true);

      router.push('/');
    } catch (error: unknown) {
      console.error('Register error Firebase:', error);

      if (error instanceof FirebaseError && error.code === 'auth/email-already-in-use') {
        setFbError(t('errorEmailInUse'));
      } else {
        setFbError(t('errorGlobal'));
      }
    }
  };

  return (
    <div className={styles.signUpContainer}>
      <DecorPanel />
      <div className={styles.contentContainer}>
        <Text as="h1" size="xxl" className={styles.title}>
          {t('createAccount')}
        </Text>

        {fbError && (
          <div className={styles.firebaseError}>
            <Text size="sm" color="error">
              {fbError}
            </Text>
          </div>
        )}

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
