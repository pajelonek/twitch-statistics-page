import * as path from 'path';
import { readAllStreamsFromDirectory, StreamMap } from './twitch/twitchUtils';
import { calculateSummaries, StreamersStatistics } from './twitch/calculatorUtils';
import { saveSummariesToFile } from './utils/fileUtils';

async function main() {
    console.log("Calculating statistics...");
    const directoryPath = path.join(__dirname, '../test_data/twitch/2024/08/10'); // TODO need to fix that later after POC
    const allStreamsFromTwitch: StreamMap = await readAllStreamsFromDirectory(directoryPath);
    const summaries: StreamersStatistics[] = calculateSummaries(allStreamsFromTwitch);
    saveSummariesToFile(summaries);
    console.log("Task completed!");
}

main();