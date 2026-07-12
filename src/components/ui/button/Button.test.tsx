import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';
import styles from './Button.module.scss';

describe('Button Component', () => {
  it('should render basic button with default variant and color when not provided', () => {
    render(<Button>Click me</Button>);

    const buttonElement = screen.getByRole('button', { name: /click me/i });

    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveAttribute('type', 'button');
    expect(buttonElement.className).toBe(`${styles.default} ${styles.primary}`);
  });

  it('should render correct classes based on variant and color props', () => {
    render(
      <Button color="none" variant="icon">
        ✖
      </Button>
    );
    const buttonElement = screen.getByRole('button');

    expect(buttonElement.className).toBe(`${styles.icon} ${styles.none}`);
    expect(buttonElement.className).not.toContain(styles.default);
  });

  it('should support light and none colors with default variant', () => {
    const { rerender } = render(<Button color="light">Light</Button>);
    let buttonElement = screen.getByRole('button', { name: /light/i });
    expect(buttonElement.className).toBe(`${styles.default} ${styles.light}`);

    rerender(<Button color="none">None</Button>);
    buttonElement = screen.getByRole('button', { name: /none/i });
    expect(buttonElement.className).toBe(`${styles.default} ${styles.none}`);
  });

  it('should combine custom className and respect type attribute', () => {
    render(
      <Button className="custom-external-class" type="submit">
        Submit Form
      </Button>
    );

    const buttonElement = screen.getByRole('button', { name: /submit form/i });

    expect(buttonElement).toHaveAttribute('type', 'submit');
    expect(buttonElement.className).toContain(`${styles.default} ${styles.primary}`);
    expect(buttonElement.className).toContain('custom-external-class');
  });

  it('should call onClick handler when clicked and respect disabled state', async () => {
    const handleClick = vi.fn();

    const { rerender } = render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );

    const buttonElement = screen.getByRole('button', { name: /disabled/i });
    expect(buttonElement).toBeDisabled();

    await userEvent.click(buttonElement);
    expect(handleClick).not.toHaveBeenCalled();

    rerender(<Button onClick={handleClick}>Enabled</Button>);
    const enabledButton = screen.getByRole('button', { name: /enabled/i });

    await userEvent.click(enabledButton);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
