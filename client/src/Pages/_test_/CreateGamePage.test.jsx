import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react';
import { vi } from 'vitest';
import CreateGamePage from '../CreateGamePage';
import { BrowserRouter } from 'react-router-dom';

// Mock socket and capture references
vi.mock('../../Firebase/socket', () => {
  const on = vi.fn();
  const emit = vi.fn();
  const off = vi.fn();
  return {
    default: {
      on,
      emit,
      off,
    },
  };
});

import socket from '../../Firebase/socket';
const { on, emit, off } = socket;

// Mock useAuth
vi.mock('../../Auth/AuthContext', () => ({
  useAuth: () => ({
    currentUser: { username: 'TestUser' },
  }),
}));

// Mock router
const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useParams: () => ({ gameCode: 'ABC123' }),
  };
});

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('CreateGamePage', () => {
  beforeEach(() => {
    on.mockReset();
    emit.mockReset();
    off.mockReset();
    navigateMock.mockReset();
  });

  it('renders the game code and UI elements', () => {
    renderWithRouter(<CreateGamePage />);
    expect(screen.getByText(/Game Code:/)).toBeInTheDocument();
    expect(screen.getByText(/Game Settings/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Leave the Game/i })).toBeInTheDocument();
  });

  it('updates sequencesNeeded on input change', () => {
    renderWithRouter(<CreateGamePage />);
    const inputs = screen.getAllByRole('spinbutton');
    const sequenceInput = inputs[0]; // First input is for sequences
    fireEvent.change(sequenceInput, { target: { value: '2' } });
    expect(sequenceInput.value).toBe('2');
  });

  it('updates timePerMove on slider input change', () => {
    renderWithRouter(<CreateGamePage />);
    const inputs = screen.getAllByRole('spinbutton');
    const timeInput = inputs[1]; // Second input is for time
    fireEvent.change(timeInput, { target: { value: '60' } });
    expect(timeInput.value).toBe('60');
  });

  it('emits leave-lobby and navigates on leave', () => {
    renderWithRouter(<CreateGamePage />);
    fireEvent.click(screen.getByRole('button', { name: /Leave the Game/i }));
    expect(emit).toHaveBeenCalledWith('leave-lobby', 'ABC123', { username: 'TestUser' });
    expect(navigateMock).toHaveBeenCalledWith('/');
  });

  it('navigates to game page on start', async () => {
    let lobbyHandler;
    on.mockImplementation((event, handler) => {
      if (event === 'lobby-update') {
        lobbyHandler = handler;
      }
    });

    renderWithRouter(<CreateGamePage />);

    // Simulate 3 players joining the lobby inside act()
    await act(async () => {
      lobbyHandler?.(['p1', 'p2', 'p3']);
    });

    const startButton = screen.getByRole('button', { name: /Start Game!/i });
    expect(startButton).not.toBeDisabled();

    fireEvent.click(startButton);
    expect(navigateMock).toHaveBeenCalledWith('/game/ABC123');
  });
});
