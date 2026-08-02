export {};
module.exports = {
  testEnvironment: "node",
  transform: {
    ".(ts|tsx|js|jsx)": "ts-jest",
  },
  moduleNameMapper: {
    "^@planning-poker/shared$": "<rootDir>/../../packages/shared/src/index.ts",
  },
  testMatch: ["**/__tests__/**/*.test.ts"],
  collectCoverage: false,
};
