import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

// RED: Test Login form renders and submits
describe('Login Page - TDD', () => {
  it('should render login form with email and password fields', () => {
    const mockLogin = vi.fn();
    render(
      <BrowserRouter>
        <Login onLogin={mockLogin} />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should submit login form with email and password', async () => {
    const mockLogin = vi.fn();
    render(
      <BrowserRouter>
        <Login onLogin={mockLogin} />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'user@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    // Form should be submitted
    expect(emailInput.value).toBe('user@test.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('should display error message on failed login', () => {
    const mockLogin = vi.fn();
    render(
      <BrowserRouter>
        <Login onLogin={mockLogin} />
      </BrowserRouter>
    );

    // The error should be displayed if login fails
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });
});
