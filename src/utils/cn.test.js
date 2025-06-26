import { cn } from './cn';

describe('cn utility function', () => {
  test('should merge strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  test('should handle conditional classes from objects', () => {
    expect(cn('foo', { bar: true, baz: false })).toBe('foo bar');
  });

  test('should handle mixed strings and objects', () => {
    expect(cn('foo', { bar: true, qux: true }, 'baz', { quux: false })).toBe('foo bar qux baz');
  });

  test('should handle arrays of classes', () => {
    expect(cn(['foo', 'bar'], ['baz'])).toBe('foo bar baz');
  });

  test('should correctly merge tailwind classes (tailwind-merge behavior)', () => {
    // Example from tailwind-merge documentation
    expect(cn('px-2 py-1 bg-red hover:bg-dark-red', 'p-3 bg-[#B91C1C]')).toBe('p-3 bg-[#B91C1C] hover:bg-dark-red');
    expect(cn('text-xl', 'text-sm')).toBe('text-sm');
  });

  test('should return empty string for no arguments or falsy values', () => {
    expect(cn()).toBe('');
    expect(cn(null, undefined, false)).toBe('');
  });

  test('should ignore falsy values in arguments', () => {
    expect(cn('foo', null, 'bar', undefined, { baz: true, qux: false })).toBe('foo bar baz');
  });
});
