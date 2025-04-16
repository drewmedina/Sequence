import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react';
import { vi } from 'vitest';
import Home from '../Home';
import { BrowserRouter } from 'react-router-dom';

const getSocketMocks = () => {
  const emit = vi.fn();
  const on = vi.fn();
  const off = vi.fn();
  return { emit, on, off };
};

const socketMocks = getSocketMocks();

vi.mock('../../Firebase/socket', () => ({
  default: {
    emit: (...args) => socketMocks.emit(...args),
    on: (...args) => socketMocks.on(...args),
    off: (...args) => socketMocks.off(...args),
  },
}));

vi.mock('../../Auth/AuthContext', () => ({
  useAuth: () => ({
    currentUser: {
      username: 'TestUser',
      email: 'test@example.com',
    },
  }),
}));

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('Home Component', () => {
  beforeEach(() => {
    socketMocks.emit.mockReset();
    socketMocks.on.mockReset();
    socketMocks.off.mockReset();
    navigateMock.mockReset();
  });

  it('displays the user avatar and username', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText('TestUser')).toBeInTheDocument();
  });

  it('calls create-game when "Create a private game" button is clicked', () => {
    renderWithRouter(<Home />);
    fireEvent.click(screen.getByRole('button', { name: /create a private game/i }));
    expect(socketMocks.emit).toHaveBeenCalledWith('create-game', {
      username: 'TestUser',
      email: 'test@example.com',
    });
  });

  it('shows join input when "Join a game" button is clicked', () => {
    renderWithRouter(<Home />);
    fireEvent.click(screen.getByRole('button', { name: /join a game/i }));
    expect(screen.getByPlaceholderText(/enter game code/i)).toBeInTheDocument();
  });

  it('emits join-lobby and navigates when valid game code is entered', () => {
    renderWithRouter(<Home />);
    fireEvent.click(screen.getByRole('button', { name: /join a game/i }));

    const input = screen.getByPlaceholderText(/enter game code/i);
    fireEvent.change(input, { target: { value: 'ABC123' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(socketMocks.emit).toHaveBeenCalledWith('join-lobby', 'ABC123', {
      username: 'TestUser',
      email: 'test@example.com',
    });
    expect(navigateMock).toHaveBeenCalledWith('/createGame/ABC123');
  });

  it('prevents joining if username already in lobby', () => {
    socketMocks.on.mockImplementation((event, cb) => {
      if (event === 'lobby-update') {
        act(() => cb(['TestUser']));
      }
    });

    renderWithRouter(<Home />);
    fireEvent.click(screen.getByRole('button', { name: /join a game/i }));

    const input = screen.getByPlaceholderText(/enter game code/i);
    fireEvent.change(input, { target: { value: 'ABC123' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(socketMocks.emit).not.toHaveBeenCalledWith('join-lobby', expect.anything());
  });
});
