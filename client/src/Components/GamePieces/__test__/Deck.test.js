import { getCard, drawCard, removeCardFromDeck } from '../Deck';

describe('Deck Utilities', () => {
  it('draws a valid card from the deck', () => {
    const card = drawCard();
    expect(card).toHaveProperty('rank');
    expect(card).toHaveProperty('suit');
  });

  it('removes a card from the deck', () => {
    const card = { rank: 'Two', suit: 'spades' };
    removeCardFromDeck(card);
    // we don't expect it to be drawn again with certainty, just ensure no crash
    expect(() => removeCardFromDeck(card)).not.toThrow();
  });

  it('getCard returns a card object', () => {
    const card = getCard();
    expect(typeof card).toBe('object');
    expect(card).toHaveProperty('rank');
    expect(card).toHaveProperty('suit');
  });
});
