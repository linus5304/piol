import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock gt-next
jest.mock('gt-next', () => ({
  useTranslations: () => (key) => key,
  useLocale: () => 'fr',
}));

jest.mock('gt-next/client', () => ({
  useTranslations: () => (key) => key,
  useLocale: () => 'fr',
  useSetLocale: () => jest.fn(),
}));

jest.mock('gt-next/server', () => ({
  getLocale: jest.fn(async () => 'fr'),
  GTProvider: ({ children }) => children,
}));

// Mock Convex
jest.mock('convex/react', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(() => jest.fn()),
  useAction: jest.fn(() => jest.fn()),
  ConvexProvider: ({ children }) => children,
}));
