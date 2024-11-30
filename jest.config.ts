import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./", // Path to Next.js app
});

const config: Config = {
  coverageProvider: "v8",
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: "jest-fixed-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.config.ts"],
  modulePaths: [
    "<rootDir>/src/app/",
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "!<rootDir>/src/middleware.ts",
    "!<rootDir>/src/lib/**",
    "!<rootDir>/src/app/api/**",
    "!<rootDir>/prisma/**",
  ],
  coverageDirectory: "<rootDir>/coverage",
  testMatch: [
    "**/src/app/**/*.{test,spec}.{ts,tsx}",
  ],
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
};

export default createJestConfig(config);
