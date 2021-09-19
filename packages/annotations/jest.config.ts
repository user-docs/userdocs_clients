export default {
  preset: 'ts-jest',
  clearMocks: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "jest-environment-jsdom-global",
  testEnvironmentOptions: { pretendToBeVisual: true }
};