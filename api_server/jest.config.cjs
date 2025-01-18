module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+\\.m?[tj]sx?$': 'babel-jest',
    },
    setupFiles: ['./jest.setup.js'], // Add this line to load jest.setup.js before tests
    // extensionsToTreatAsEsm: ['.ts'], // Treat .js and .ts files as ESM
};