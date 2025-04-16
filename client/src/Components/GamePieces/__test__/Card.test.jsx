import { render, screen } from '@testing-library/react';
import Card from '../Card';
import React from 'react';

describe('Card Component', () => {
  it('renders correct symbol for a heart Queen', () => {
    render(<Card rank="Queen" suit="hearts" />);
    expect(screen.getByText("🂽")).toBeInTheDocument();
  });

  it('renders correct symbol for a club Ace', () => {
    render(<Card rank="Ace" suit="clubs" />);
    expect(screen.getByText("🃑")).toBeInTheDocument();
  });

  it('renders joker card symbol', () => {
    render(<Card rank="RJoker1" suit="redJokers" />);
    expect(screen.getByText("🃟")).toBeInTheDocument();
  });
});
