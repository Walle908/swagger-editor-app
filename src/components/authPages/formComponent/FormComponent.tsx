import { type InputHTMLAttributes, type ReactNode, forwardRef, useState, useId } from 'react';
import { Text } from '@/components/ui';
import Image from 'next/image';
import { Button } from '@/components/ui';
import showIcon from 'public/show.svg';
import hideIcon from 'public/hide.svg';
import clsx from 'clsx';
import styles from './FormComponent.module.scss';

interface FormComponentProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  isPassword?: boolean;
}

const FormComponent = forwardRef<HTMLInputElement, FormComponentProps>(
  (
    { className = '', placeholder = '', isPassword = false, label, error, ...props },
    ref
  ): ReactNode => {
    const [showPassword, setShowPassword] = useState(false);

    const errorClass = error ? styles.error : '';
    const combinedClasses = clsx(styles.default, errorClass, className);

    const generatedId = useId();
    const inputId = props.id ?? generatedId;

    return (
      <div className={styles.container}>
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>

        {isPassword ? (
          <div className={styles.passwordWrapper}>
            <input
              id={inputId}
              type={showPassword ? 'text' : 'password'}
              className={combinedClasses}
              placeholder={placeholder}
              autoComplete="off"
              ref={ref}
              {...props}
            />
            <Button
              color="none"
              variant="icon"
              className={styles.eyeButton}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Show password' : 'Hide password'}>
              {showPassword ? (
                <Image alt="Show password" src={showIcon} width={16} height={16} />
              ) : (
                <Image alt="Hide password" src={hideIcon} width={16} height={16} />
              )}
            </Button>
          </div>
        ) : (
          <input
            id={inputId}
            className={combinedClasses}
            placeholder={placeholder}
            autoComplete="off"
            ref={ref}
            {...props}
          />
        )}

        <Text as="span" size="xxs" color="error" className={styles.errorText}>
          {error || ''}
        </Text>
      </div>
    );
  }
);

FormComponent.displayName = 'FormComponent';
export default FormComponent;
