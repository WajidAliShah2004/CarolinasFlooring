import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LeadForm } from './LeadForm';

async function fillValid() {
  await userEvent.type(screen.getByLabelText('Name'), 'Pat Smith');
  await userEvent.type(screen.getByLabelText('Email'), 'pat@example.com');
  await userEvent.type(screen.getByLabelText('Phone'), '704-555-0100');
  await userEvent.type(screen.getByLabelText("What you're looking for"), 'Two bedrooms, carpet.');
}

describe('LeadForm', () => {
  it('shows inline errors and does not submit when empty', async () => {
    const submit = vi.fn();
    render(<LeadForm submit={submit} />);
    await userEvent.click(screen.getByRole('button', { name: 'Send to David' }));
    expect(screen.getByText('Please enter your name.')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
    expect(submit).not.toHaveBeenCalled();
  });

  it('uses a numeric keypad for phone and a guiding placeholder for the message', () => {
    render(<LeadForm submit={vi.fn()} />);
    expect(screen.getByLabelText('Phone')).toHaveAttribute('inputmode', 'tel');
    expect(screen.getByLabelText("What you're looking for")).toHaveAttribute(
      'placeholder',
      expect.stringContaining('Which rooms'),
    );
  });

  it('submits every field and shows the success state', async () => {
    const submit = vi.fn().mockResolvedValue({ ok: true });
    render(<LeadForm submit={submit} />);
    await fillValid();
    await userEvent.click(screen.getByRole('button', { name: 'Send to David' }));
    expect(submit).toHaveBeenCalledWith(
      {
        name: 'Pat Smith',
        email: 'pat@example.com',
        phone: '704-555-0100',
        message: 'Two bedrooms, carpet.',
        company: '',
      },
      { forceError: false },
    );
    expect(await screen.findByRole('status')).toHaveTextContent('David will be in touch');
  });

  it('shows a retry message on failure and keeps the form', async () => {
    const submit = vi.fn().mockResolvedValue({ ok: false, error: 'mock-failure' });
    render(<LeadForm submit={submit} />);
    await fillValid();
    await userEvent.click(screen.getByRole('button', { name: 'Send to David' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Please try again');
    expect(screen.getByRole('button', { name: 'Send to David' })).toBeEnabled();
  });
});
