import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Play from '../Play';

describe('Play Component', () => {
  const getEmojiCardsFromHand = () => {
    const handCardWrappers = document.querySelectorAll('.sc-gNZgCX.bLOiiD');
    return Array.from(handCardWrappers).map(wrapper =>
      wrapper.querySelector('.sc-FEMpB')?.textContent.trim()
    ).filter(Boolean);
  };

  it('renders 7 cards initially', () => {
    render(<Play />);
    const cards = getEmojiCardsFromHand();
    expect(cards.length).toBe(7);
  });

  it('draws an extra card when "Draw Card" is clicked', () => {
    render(<Play />);
    fireEvent.click(screen.getByRole('button', { name: /draw card/i }));
    const cards = getEmojiCardsFromHand();
    expect(cards.length).toBe(8);
  });

  it('replaces all cards when "New Cards" is clicked', () => {
    render(<Play />);
    fireEvent.click(screen.getByRole('button', { name: /new cards/i }));
    const cards = getEmojiCardsFromHand();
    expect(cards.length).toBe(7);
  });
});
