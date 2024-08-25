import * as fs from 'fs';
import { StreamersStatistics } from '../twitch/calculatorUtils';

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


export async function saveSummariesToFile(summaries: StreamersStatistics[]): Promise<void> {
    try {
        const jsonData = JSON.stringify(summaries, null, 2);
        const filePath = generateFileNameWithDate();
        await fs.promises.writeFile(filePath, jsonData, 'utf8');
        console.log(`Summaries saved to ${filePath}`);
    } catch (error) {
        console.error('Error saving summaries to file:', error);
        throw error;
    }
}


function generateFileNameWithDate(extension: string = 'json'): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');
    
    return `streams_${year}-${month}-${day}.${extension}`;
}
