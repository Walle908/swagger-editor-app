import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';
import styles from './Input.module.scss';

describe('Input Component', () => {
  it('should render basic input with default variant when not provided', () => {
    render(<Input placeholder="Enter text" />);

    const inputElement = screen.getByPlaceholderText('Enter text');

    expect(inputElement).toBeInTheDocument();
    expect((inputElement as HTMLInputElement).type).toBe('text');
    expect(inputElement.className).toBe(styles.default);
  });

  it('should render correct class based on variant="none"', () => {
    render(<Input variant="none" placeholder="None input" />);

    const inputElement = screen.getByPlaceholderText('None input');

    expect(inputElement.className).toBe(styles.none);
    expect(inputElement.className).not.toContain(styles.default);
  });

  it('should combine custom className and respect standard HTML attributes', () => {
    render(<Input className="custom-external-input" type="password" placeholder="Password" />);

    const inputElement = screen.getByPlaceholderText('Password');

    expect(inputElement).toHaveAttribute('type', 'password');
    expect(inputElement.className).toContain(styles.default);
    expect(inputElement.className).toContain('custom-external-input');
  });

  it('should handle user typing correctly', async () => {
    render(<Input placeholder="Type here" />);

    const inputElement = screen.getByPlaceholderText('Type here') as HTMLInputElement;

    await userEvent.type(inputElement, 'Hello World');

    expect(inputElement.value).toBe('Hello World');
  });

  it('should respect disabled state and block interactions', async () => {
    render(<Input disabled placeholder="Disabled input" />);

    const inputElement = screen.getByPlaceholderText('Disabled input');

    expect(inputElement).toBeDisabled();

    await userEvent.type(inputElement, 'Trying to type');
    expect((inputElement as HTMLInputElement).value).toBe('');
  });
});
