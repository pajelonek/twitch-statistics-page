import * as fs from 'fs';
import { readJsonFile } from '../../src/utils/file-utils';

jest.mock('fs');

describe('Testing reading from file as JSON', () => {
    const mockReadFile = jest.spyOn(fs.promises, 'readFile');

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should read and parse a valid JSON file', async () => {
        const mockData = JSON.stringify({ key: 'value' });
        mockReadFile.mockResolvedValue(mockData);

        const result = await readJsonFile<{ key: string }>('/path/to/file.json');

        expect(mockReadFile).toHaveBeenCalledWith('/path/to/file.json', 'utf8');
        expect(result).toEqual({ key: 'value' });
    });

    it('should throw an error if the file content is not valid JSON', async () => {
        mockReadFile.mockResolvedValue('invalid json');

        await expect(readJsonFile('/path/to/file.json')).rejects.toThrow(SyntaxError);

        expect(mockReadFile).toHaveBeenCalledWith('/path/to/file.json', 'utf8');
    });

    it('should throw an error if reading the file fails', async () => {
        const error = new Error('File not found');
        mockReadFile.mockRejectedValue(error);

        await expect(readJsonFile('/path/to/nonexistent-file.json')).rejects.toThrow('File not found');

        expect(mockReadFile).toHaveBeenCalledWith('/path/to/nonexistent-file.json', 'utf8');
    });
});
