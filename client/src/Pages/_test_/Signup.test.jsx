import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Signup from '../Signup';
import { vi } from 'vitest';

// Mock useAuth BEFORE import
vi.mock('../../Auth/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../../Auth/AuthContext'; // Import after mock

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('Signup Component', () => {
  it('renders signup form inputs and button', () => {
    useAuth.mockReturnValue({ signup: vi.fn() });
    renderWithRouter(<Signup />);

    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  it('submits form and calls signup with correct inputs', () => {
    const signupMock = vi.fn();
    useAuth.mockReturnValue({ signup: signupMock });

    renderWithRouter(<Signup />);

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: '12345678' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: '12345678' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    expect(signupMock).toHaveBeenCalledWith(
      'test@example.com',
      'testuser',
      '12345678',
      '12345678'
    );
  });
});
