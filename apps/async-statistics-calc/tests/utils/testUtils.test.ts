import { extractTimestampFromFilename } from "../../src/utils/fileUtils";

describe("testUtils tests", () => {
    test('should extract timeStamp from filename', () => {
        const timeStamp: string = extractTimestampFromFilename("20240810T102724903Z.json")
        expect(timeStamp).toBe("20240810T102724903Z");
    })


    it('should throw an error for an invalid filename format', () => {
        const invalidFilePath = 'invalid_filename.json';
        expect(() => extractTimestampFromFilename(invalidFilePath)).toThrow('Date cannot be parsed from filename');
      });

});