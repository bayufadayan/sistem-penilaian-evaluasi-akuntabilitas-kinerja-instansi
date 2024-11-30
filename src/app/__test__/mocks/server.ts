import { setupServer } from 'msw/node';
import { handlers } from "./handlers";

// Setup Mock Service Worker
export const server = setupServer(...handlers);

// Enable API mocking before tests
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests,
afterEach(() => server.resetHandlers());

// Close API mocking server after all tests are finished
afterAll(() => server.close());
