'use client';

import { type ReactNode, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { getLoginSchema, LoginFields } from '@/schema/authValidation';
import FormComponent from '../formComponent/FormComponent';
import { Button } from '@/components/ui';
import styles from './LoginForm.module.scss';

interface LoginFormProps {
  onSubmit: (data: LoginFields) => void;
}

export default function LoginForm({ onSubmit }: LoginFormProps): ReactNode {
  const t = useTranslations('Form');
  const tErr = useTranslations('AuthErrors');

  const loginSchema = useMemo(() => getLoginSchema(tErr), [tErr]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormComponent
        type="email"
        placeholder={t('placeholderEmail')}
        label={t('email')}
        error={errors.email?.message}
        {...register('email')}
      />

      <FormComponent
        isPassword
        placeholder={t('placeholderPassword')}
        label={t('password')}
        error={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" disabled={isSubmitting}>
        {t('signIn')}
      </Button>
    </form>
  );
}
