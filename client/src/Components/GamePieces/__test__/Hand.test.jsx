import { renderHook, act } from '@testing-library/react';
import Hand from '../Hand';

describe('Hand Hook', () => {
  it('generates 7 cards on init', () => {
    const { result } = renderHook(() => Hand());
    expect(result.current.getCards()).toHaveLength(7);
  });

  it('generates new set of 7 cards on setNewCards', () => {
    const { result } = renderHook(() => Hand());
    const initialCards = result.current.getCards();
    act(() => {
      result.current.setNewCards();
    });
    const newCards = result.current.getCards();
    expect(newCards).toHaveLength(7);
    expect(newCards).not.toEqual(initialCards); // likely different
  });
});
