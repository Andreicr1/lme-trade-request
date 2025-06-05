/** @jest-environment jsdom */
import { parseInputDate, getSecondBusinessDay, getFixPpt } from '../main.mjs';

describe('parseInputDate', () => {
  test('parses yyyy-mm-dd string', () => {
    const date = parseInputDate('2025-06-05');
    expect(date).toBeInstanceOf(Date);
    expect(date.getFullYear()).toBe(2025);
  });
});

describe('getSecondBusinessDay', () => {
  test('returns formatted string', () => {
    const result = getSecondBusinessDay(2025, 0); // Janeiro
    expect(typeof result).toBe('string');
    expect(result).toMatch(/^\d{2}-\d{2}-\d{2}$/);
  });
});

describe('getFixPpt', () => {
  test('calculates 2nd business day after fix date', () => {
    const result = getFixPpt('2025-01-02');
    expect(result).toMatch(/^\d{2}-\d{2}-\d{2}$/);
  });
});


