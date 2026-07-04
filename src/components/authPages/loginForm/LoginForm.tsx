'use client';

import { type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFields } from '@/schema/authValidation';
import FormComponent from '../formComponent/FormComponent';
import { Button } from '@/components/ui';
import styles from './LoginForm.module.scss';

interface LoginFormProps {
  onSubmit: (data: LoginFields) => void;
}

export default function LoginForm({ onSubmit }: LoginFormProps): ReactNode {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty, isSubmitting },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const isButtonDisabled = !isDirty || !isValid || Object.keys(errors).length > 0 || isSubmitting;

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormComponent
        type="email"
        placeholder="Enter your email..."
        label="Email"
        error={errors.email?.message}
        {...register('email')}
      />

      <FormComponent
        isPassword
        placeholder="Enter your password..."
        label="Password"
        error={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" disabled={isButtonDisabled}>
        Submit
      </Button>
    </form>
  );
}
