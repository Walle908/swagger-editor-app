import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Text } from './Text';
import styles from './Text.module.scss';

describe('Text Component', () => {
  it('should render default paragraph element with default classes', () => {
    render(<Text>Hello World</Text>);

    const textElement = screen.getByText('Hello World');

    expect(textElement).toBeInTheDocument();
    expect(textElement.tagName.toLowerCase()).toBe('p');
    expect(textElement.className).toContain(styles.sm);
    expect(textElement.className).toContain(styles.main);
  });

  it('should render correct HTML tag based on "as" prop', () => {
    const { rerender } = render(<Text as="h1">Heading 1</Text>);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

    rerender(<Text as="span">Span</Text>);
    const spanElement = screen.getByText('Span');
    expect(spanElement.tagName.toLowerCase()).toBe('span');
  });

  it('should apply correct classes based on size, color, weight and font props', () => {
    render(
      <Text size="xxl" color="error" weight="bold" font="code">
        Error Message
      </Text>
    );

    const textElement = screen.getByText('Error Message');

    expect(textElement.className).toContain(styles.xxl);
    expect(textElement.className).toContain(styles.error);
    expect(textElement.className).toContain(styles.bold);
    expect(textElement.className).toContain(styles.code);
  });

  it('should combine custom className and forward standard HTML attributes', () => {
    render(
      <Text className="custom-external-text" id="welcome-text" data-testid="text-block">
        Custom text
      </Text>
    );

    const textElement = screen.getByTestId('text-block');

    expect(textElement).toHaveAttribute('id', 'welcome-text');
    expect(textElement.className).toContain('custom-external-text');
    expect(textElement.className).toContain(styles.sm);
  });
});
