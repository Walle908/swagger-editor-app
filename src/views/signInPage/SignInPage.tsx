'use client';

import { type ReactNode } from 'react';
import LoginForm from '@/components/authPages/loginForm/LoginForm';
import { LoginFields } from '@/schema/authValidation';
import styles from './SignInPage.module.scss';

export default function SignInPage(): ReactNode {
  const handleFormSubmit = (data: LoginFields) => {
    console.log(data);
  };

  return (
    <div className={styles.signInContainer}>
      <LoginForm onSubmit={handleFormSubmit} />
    </div>
  );
}
