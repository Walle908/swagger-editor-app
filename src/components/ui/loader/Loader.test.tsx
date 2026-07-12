import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Loader } from './Loader';
import styles from './Loader.module.scss'; // Реальные стили

describe('Loader Component', () => {
  it('should render successfully in the DOM', () => {
    render(<Loader />);

    const loaderElement = screen.getByTestId('loader-element');

    expect(loaderElement).toBeInTheDocument();
  });

  it('should apply the correct loader style class', () => {
    render(<Loader />);

    const loaderElement = screen.getByTestId('loader-element');

    expect(loaderElement.className).toBe(styles.loader);
  });

  it('should render as a div element html tag', () => {
    render(<Loader />);

    const loaderElement = screen.getByTestId('loader-element');

    expect(loaderElement.tagName.toLowerCase()).toBe('div');
  });
});
