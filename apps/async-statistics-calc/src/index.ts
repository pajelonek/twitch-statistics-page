import * as path from 'path';
import { calculateSummaries } from './twitch/calculatorUtils';
import { readAllStreamsFromDirectory } from './twitch/twitchUtils';
import { StreamersStatistics, StreamMap } from './twitch/types';
import { createSummaryToFile, removeAllFilesFromDirectory } from './utils/fileUtils';

async function main() {
    console.log("Calculating statistics...");
    const directoryPath = path.join(__dirname, process.env.DIRECTORY_PATH!); // TODO need to fix that later after POC
    const allStreamsFromTwitch: StreamMap = await readAllStreamsFromDirectory(directoryPath);
    const summaries: StreamersStatistics[] = calculateSummaries(allStreamsFromTwitch);
    await createSummaryToFile(summaries);
    removeAllFilesFromDirectory(directoryPath);
    console.log("Task completed!");
}

main();