import { describe, expect, it } from 'vitest';
import { shuffle } from './shuffle';

describe('shuffle', () => {
  it('keeps all items without mutation', () => {
    const input = ['a', 'b', 'c', 'd'];
    const output = shuffle(input);

    expect(output).toHaveLength(input.length);
    expect([...output].sort()).toEqual([...input].sort());
    expect(input).toEqual(['a', 'b', 'c', 'd']);
  });
});
