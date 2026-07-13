import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { FormatSwitcher } from './FormatSwitcher';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/components/ui', () => ({
  Input: ({ value, className }: { value: string; className?: string }) => (
    <input type="text" value={value} className={className} readOnly />
  ),
}));

describe('FormatSwitcher Component', () => {
  test('should render successfully and capture explicit segment control interactive clicks', () => {
    const mockOnToggleAction = vi.fn();

    render(<FormatSwitcher format="json" onToggleAction={mockOnToggleAction} />);

    const jsonInput = screen.getByDisplayValue('JSON');
    const yamlInput = screen.getByDisplayValue('YAML');
    expect(jsonInput).toBeInTheDocument();
    expect(yamlInput).toBeInTheDocument();

    expect(screen.getByText('autoConvert')).toBeInTheDocument();

    const segmentControlContainer = jsonInput.closest('div');
    if (segmentControlContainer) {
      fireEvent.click(segmentControlContainer);
    }

    expect(mockOnToggleAction).toHaveBeenCalledTimes(1);
  });
});
