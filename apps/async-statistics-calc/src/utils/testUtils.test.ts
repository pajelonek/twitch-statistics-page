import * as fs from 'fs';
import * as path from 'path';
import { clearDirectory, createDateFromString, extractTimestampFromFilename, getDirectoryPath, persistSummaries, readJsonFile } from './fileUtils';

jest.mock('fs', () => {
    const actualFs = jest.requireActual('fs'); // Get the actual 'fs' module for other functions

    return {
        ...actualFs,
        promises: {
            writeFile: jest.fn(),
            readFile: jest.fn()
        },
        existsSync: jest.fn(),
        readdirSync: jest.fn(),
        statSync: jest.fn(),
        unlinkSync: jest.fn(),
        rmdirSync: jest.fn(),
    };
});

describe('Utility Functions', () => {
    describe('extractTimestampFromFilename', () => {
        it('should extract timestamp from a valid filename', () => {
            const filename = '20220912T123456789Z.json';
            const timestamp = extractTimestampFromFilename(filename);
            expect(timestamp).toBe('20220912T123456789Z');
        });

        it('should throw error if the filename is invalid', () => {
            const filename = 'invalid_filename.json';
            expect(() => extractTimestampFromFilename(filename)).toThrow('Date cannot be parsed from filename');
        });
    });

    describe('createDateFromString', () => {
        it('should create a Date object from a valid timestamp', () => {
            const timestamp = '20220912T123456789';
            const date = createDateFromString(timestamp);
            expect(date.toISOString()).toBe('2022-09-12T12:34:56.789Z');
        });
    });

    describe('persistSummaries', () => {
        const summaries = [{ 
            streamerId: 'testId', 
            streamerLogin: 'testLogin',
            streamerName: 'testName', 
            statistics: {
                watchHours: 1,
                avgViewers: 2,
                peakViewers: 3,
                streamedHours: 4,
            } 
        }];
    
        let writeFileSpy: jest.SpyInstance;
    
        beforeEach(() => {
            // Reset environment variables before each test
            process.env.MOCKED = 'true';
            process.env.DIRECTORY_PATH = '/base/path';
            process.env.DIRECTORY_MOCKED_YESTERDAY_PATH = '/mocked/yesterday';
            process.env.DIRECTORY_MOCKED_YESTERDAY_MONTH_PATH = '/mocked/yesterday';
            process.env.SUMMARY_OUTPUT_FILENAME = 'summary.json';
    
            // Clear mocks and set up spies
            jest.clearAllMocks();
            writeFileSpy = jest.spyOn(fs.promises, 'writeFile').mockResolvedValue();
        });
    
        it('should create a new summary file if it does not exist', async () => {
            jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    
            await persistSummaries(summaries);
    
            expect(writeFileSpy).toHaveBeenCalled();
        });
    
        it('should update an existing summary file if it exists', async () => {
            jest.spyOn(fs, 'existsSync').mockReturnValue(true);
            jest.spyOn(fs.promises, 'readFile').mockResolvedValue(JSON.stringify(summaries));
    
            await persistSummaries(summaries);
    
            expect(writeFileSpy).toHaveBeenCalled();
        });
    });
});