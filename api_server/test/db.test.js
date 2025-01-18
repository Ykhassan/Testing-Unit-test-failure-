import { sequelize, postgresDB } from '../configs/postgresDB.js';
import logger from '../configs/logger.js';

// Mock the logger module
jest.mock('../configs/logger.js', () => ({
    info: jest.fn(),
    error: jest.fn(),
}));

jest.mock('sequelize', () => {
    return {
        Sequelize: jest.fn().mockImplementation(() => ({
            authenticate: jest.fn(),
        })),
    };
});

describe('Database Connection Tests', () => {
    const mockError = new Error('Test connection error');

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should log a success message if connection is successful', async () => {
        sequelize.authenticate.mockResolvedValueOnce(undefined);

        await postgresDB();

        expect(sequelize.authenticate).toHaveBeenCalledTimes(1);

        expect(logger.info).toHaveBeenCalledWith('Postgres db connection has been established successfully.');
    })

    test('should log an error if connection fails', async () => {

        sequelize.authenticate.mockRejectedValueOnce(mockError);

        await postgresDB();

        expect(sequelize.authenticate).toHaveBeenCalledTimes(1);

        expect(logger.error).toHaveBeenCalledWith('Unable to connect to postgres', mockError);
    });
});