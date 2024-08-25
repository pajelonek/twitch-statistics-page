import * as fs from 'fs';
import { StreamersStatistics } from '../twitch/types';

export async function readJsonFile<T>(filePath: string): Promise<T> {
    const data: string = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(data) as T;
}

export function extractTimestampFromFilename(filePath: string): string {
    const regex = /(\d{8}T\d{9}Z)\.json$/;
    const match = filePath.match(regex);
    
    if (match) {
        return match[1];
    } else {
        throw new Error("Date cannot be parsed from filename");
    }
}

export function createDateFromString(timestamp: string): Date {
    const year = timestamp.slice(0, 4);
    const month = timestamp.slice(4, 6);
    const day = timestamp.slice(6, 8);
    const time = timestamp.slice(9, 15);
    const milliseconds = timestamp.slice(15, 18);

    const isoString = `${year}-${month}-${day}T${time.slice(0, 2)}:${time.slice(2, 4)}:${time.slice(4, 6)}.${milliseconds}Z`;

    return new Date(isoString);
}

export function createSummaryToFile(summaries: StreamersStatistics[]) {
    if (fs.existsSync(process.env.SUMMARY_OUTPUT_DIR! + process.env.SUMMARY_OUTPUT_FILENAME!)) {
        // update file
        console.log("updating file");
    }
    else {
        console.log("writing file")
        saveSummariesToFile(summaries);
    }
}

async function saveSummariesToFile(summaries: StreamersStatistics[]): Promise<void> {
    if (process.env.SAVE_OUTPUT_FILE === "false") {
        console.log("Saving is disabled");
    }
    else {
        try {
            const jsonData = JSON.stringify(summaries, null, 2);
            await fs.promises.writeFile(process.env.SUMMARY_OUTPUT_DIR! + process.env.SUMMARY_OUTPUT_FILENAME!, jsonData, 'utf8');
        } catch (error) {
            console.error('Error saving summaries to file:', error);
            throw error;
        }
    }
}

function removeAllOutDatedFiles(directoryPath: string): void {
    // removeAllFilesAndDirectories()
}


function removeAllFilesAndDirectories(directoryPath: string): void {
    try {
        fs.rm(directoryPath, { recursive: true, force: true });
        console.log('All files and directories removed successfully');
    } catch (err) {
        console.error('Error removing files and directories:', err);
    }
}
