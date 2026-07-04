'use client';

import { type ReactNode } from 'react';
import RegisterForm from '@/components/authPages/registerForm/RegisterForm';
import styles from './SignUpPage.module.scss';
import { RegisterFields } from '@/schema/authValidation';

export default function SignUpPage(): ReactNode {
  const handleFormSubmit = (data: RegisterFields) => {
    console.log(data);
  };

  return (
    <div className={styles.signUpContainer}>
      <RegisterForm onSubmit={handleFormSubmit} />
    </div>
  );
}
