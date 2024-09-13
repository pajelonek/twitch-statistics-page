import * as path from 'path';
import { calculateSummaries } from './twitch/calculatorUtils';
import { readAllStreamsFromDirectory } from './twitch/twitchUtils';
import { StreamersStatistics, StreamMap } from './twitch/types';
import { persistSummaries, clearDirectory, getDirectoryPath } from './utils/fileUtils';

async function main() {
    console.log("Calculating statistics...");
    const directoryPath = getDirectoryPath();
    const allStreamsFromTwitch: StreamMap = await readAllStreamsFromDirectory(directoryPath);
    const summaries: StreamersStatistics[] = calculateSummaries(allStreamsFromTwitch);
    await persistSummaries(summaries);
    clearDirectory(directoryPath);
    console.log("Task completed!");
}

main();