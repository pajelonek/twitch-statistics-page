import * as path from 'path';
import { calculateSummaries, readAllStreamsFromDirectory } from './twitch/twitch-utils';

async function main() {
    console.log("Calculating statistics...");
    const directoryPath = path.join(__dirname, './test_data/twitch/2024/08/10');
    const allStreamsFromTwitch = await readAllStreamsFromDirectory(directoryPath);
    const summaries = calculateSummaries(allStreamsFromTwitch);
    console.log("Task completed!");
}

main();