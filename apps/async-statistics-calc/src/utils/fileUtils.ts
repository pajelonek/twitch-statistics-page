import * as fs from 'fs';
import * as path from 'path';

import { StreamersStatistics } from '../twitch/types';
import { updateSummaries } from '../twitch/calculatorUtils';

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

export async function createSummaryToFile(summaries: StreamersStatistics[]) {
    const summaryFilePath = process.env.SUMMARY_OUTPUT_DIR! + process.env.SUMMARY_OUTPUT_FILENAME!;
    if (fs.existsSync(summaryFilePath)) {
        console.log("Updating already existing summary file");
        let summaryFile: StreamersStatistics[] = await readJsonFile<StreamersStatistics[]>(summaryFilePath);
        const newSummaryFile = updateSummaries(summaryFile, summaries);
        saveToFile<StreamersStatistics[]>(newSummaryFile);
    }
    else {
        console.log("Creating new summary file")
        saveToFile<StreamersStatistics[]>(summaries);
    }
}

async function saveToFile<T>(content: T): Promise<void> {
    if (process.env.SAVE_OUTPUT_FILE === "false") {
        console.log("Saving is disabled");
    }
    else {
        try {
            const jsonData = JSON.stringify(content, null, 2);
            await fs.promises.writeFile(process.env.SUMMARY_OUTPUT_DIR! + process.env.SUMMARY_OUTPUT_FILENAME!, jsonData, 'utf8');
        } catch (error) {
            console.error('Error saving to file:', error);
            throw error;
        }
    }
}

export function clearDirectory(dirPath: string): void {
    try {
        const files = fs.readdirSync(dirPath);

        files.forEach((file) => {
            const filePath = path.join(dirPath, file);
            
            if (fs.statSync(filePath).isFile()) {
                fs.unlinkSync(filePath);
            }
        });

        fs.rmdirSync(dirPath);
        console.log(`Removed directory: ${dirPath}`);
  
        console.log('All files have been removed.');
    } catch (err) {
      console.error(`Error removing files: ${err}`);
    }
}
  
export function getDirectoryPath(): string {
    const isMocked = process.env.MOCKED!;
    if (isMocked === "true") {
        return path.join(__dirname, process.env.DIRECTORY_PATH!);
    }
    else {
        console.log(getYesterdayPath())
        return getYesterdayPath()
    }
}

function getYesterdayPath() {
    // test check
    if (fs.existsSync("/home/runner/work/twitch-statistics-page/twitch-statistics-page/apps/async-statistics-calc/dist/data/twitch/2024/08/31")) {
        console.log("jest")
    }
    else {
        console.log("Nie ma")
    }
    const today = new Date();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const year = yesterday.getFullYear();
    const month = (yesterday.getMonth() + 1).toString().padStart(2, '0'); 
    const day = yesterday.getDate().toString().padStart(2, '0');
    
    const yesterdaysPath = path.join('./data', 'twitch', year.toString(), month, day);
    
  return yesterdaysPath;
}