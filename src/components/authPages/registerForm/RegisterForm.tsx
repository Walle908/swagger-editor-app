'use client';

import { type ReactNode } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFields } from '@/schema/authValidation';
import FormComponent from '../formComponent/FormComponent';
import PasswordStrengthIndicator from '../passwordStrengthIndicator/PasswordStrengthIndicator';
import { Button } from '@/components/ui';
import styles from './RegisterForm.module.scss';

interface RegisterFormProps {
  onSubmit: (data: RegisterFields) => void;
}

export default function RegisterForm({ onSubmit }: RegisterFormProps): ReactNode {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isDirty, isSubmitting },
  } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const passwordValue = useWatch({
    control,
    name: 'password',
    defaultValue: '',
  });

  const isButtonDisabled = !isDirty || !isValid || Object.keys(errors).length > 0 || isSubmitting;

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormComponent
        type="text"
        placeholder="Enter your name..."
        label="Name"
        error={errors.name?.message}
        {...register('name')}
      />
      <FormComponent
        type="email"
        placeholder="Enter your email..."
        label="Email"
        error={errors.email?.message}
        {...register('email')}
      />
      <div className={styles.columnWrapper}>
        <FormComponent
          isPassword
          placeholder="Enter your password..."
          label="Password"
          error={errors.password?.message}
          {...register('password')}
        />
        <PasswordStrengthIndicator value={passwordValue} />
      </div>
      <FormComponent
        isPassword
        placeholder="Confirm password..."
        label="Confirm password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />
      <Button type="submit" disabled={isButtonDisabled}>
        Create account
      </Button>
    </form>
  );
}
