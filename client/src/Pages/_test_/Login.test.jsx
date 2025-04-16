import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import { vi } from 'vitest';

// Mock useAuth BEFORE import
vi.mock('../../Auth/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../../Auth/AuthContext'; // Import after mock

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('Login Component', () => {
  it('renders login form inputs and button', () => {
    useAuth.mockReturnValue({ signin: vi.fn() }); // Safe to mock here
    renderWithRouter(<Login />);

    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  it('submits form and calls signin', async () => {
    const signinMock = vi.fn();
    useAuth.mockReturnValue({ signin: signinMock });

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    expect(signinMock).toHaveBeenCalledWith('test@example.com', 'password123');
  });
});
