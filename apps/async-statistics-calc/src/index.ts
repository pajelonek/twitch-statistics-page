import * as fs from 'fs';
import * as path from 'path';
import { Stream, StreamsArray } from './model/GetStreamsResponse';

async function main() {
    console.log("Calculating statistics...");
    const directoryPath = path.join(__dirname, './test_data/twitch/2024/08/10');
    await readAllStreamsFromDirectory(directoryPath);
    console.log("Task completed!");
}

async function readAllStreamsFromDirectory(directoryPath: string): Promise<void> {
    let streamResponseFromAllDay: StreamsArray[];
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error("Error reading directory:", err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(directoryPath, file);

            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error("Error getting file stats:", err);
                    return;
                }

                if (stats.isFile()) {
                    console.log("IS FILE");
                    const streamsResponse: Stream[] = readJsonFile<Stream[]>(filePath);
                    streamResponseFromAllDay.push({ streams: streamsResponse });
                } else {
                    console.log("Destination is not a file: ", stats);
                }
            });
        });
    });

}

function readJsonFile<T>(filePath: string): T {
    const fullPath = path.resolve(__dirname, filePath);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(fileContents) as T;
}

main();