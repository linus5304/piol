import {
  formatCurrency,
  formatPhoneNumber,
  formatRelativeTime,
  getInitials,
  isValidCameroonPhone,
} from '../lib/utils';

describe('formatCurrency', () => {
  it('formats XAF correctly', () => {
    // Use regex to handle different space characters (regular vs non-breaking)
    expect(formatCurrency(150000)).toMatch(/150[\s\u00A0]000 FCFA/);
  });

  it('formats large numbers correctly', () => {
    expect(formatCurrency(1500000)).toMatch(/1[\s\u00A0]500[\s\u00A0]000 FCFA/);
  });

  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('0 FCFA');
  });
});

describe('formatRelativeTime', () => {
  it('returns "Just now" for recent timestamps', () => {
    const now = Date.now();
    expect(formatRelativeTime(now - 10000)).toBe('Just now');
  });

  it('returns minutes ago', () => {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    expect(formatRelativeTime(fiveMinutesAgo)).toBe('5 mins ago');
  });

  it('returns hours ago', () => {
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
    expect(formatRelativeTime(twoHoursAgo)).toBe('2 hours ago');
  });

  it('returns days ago', () => {
    const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
    expect(formatRelativeTime(threeDaysAgo)).toBe('3 days ago');
  });
});

describe('isValidCameroonPhone', () => {
  it('validates phone starting with +237', () => {
    expect(isValidCameroonPhone('+237612345678')).toBe(true);
  });

  it('validates phone starting with 237', () => {
    expect(isValidCameroonPhone('237612345678')).toBe(true);
  });

  it('validates phone starting with 6', () => {
    expect(isValidCameroonPhone('612345678')).toBe(true);
  });

  it('validates phone with spaces', () => {
    expect(isValidCameroonPhone('+237 612 345 678')).toBe(true);
  });

  it('rejects invalid phone numbers', () => {
    expect(isValidCameroonPhone('12345')).toBe(false);
    expect(isValidCameroonPhone('412345678')).toBe(false);
  });
});

describe('formatPhoneNumber', () => {
  it('formats +237 phone numbers', () => {
    expect(formatPhoneNumber('+237612345678')).toBe('+237 612 345 678');
  });

  it('formats local phone numbers', () => {
    expect(formatPhoneNumber('612345678')).toBe('612 345 678');
  });
});

describe('getInitials', () => {
  it('returns initials from first and last name', () => {
    expect(getInitials('Jean', 'Dupont')).toBe('JD');
  });

  it('returns first name initial only', () => {
    expect(getInitials('Jean')).toBe('J');
  });

  it('returns ? for undefined names', () => {
    expect(getInitials()).toBe('?');
  });
});
