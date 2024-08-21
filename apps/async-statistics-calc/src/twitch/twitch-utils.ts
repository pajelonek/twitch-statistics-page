import * as fs from 'fs';
import * as path from 'path';
import { extractTimestampFromFilename, readJsonFile } from "../utils/file-utils";
import { Stream } from '../model/GetStreamsResponse';

interface StreamMap { 
    [streamerID: string]: Stream[] 
};


export async function readAllStreamsFromDirectory(directoryPath: string): Promise<StreamMap> {
    const streamResponseFromAllDay: { [streamerID: string]: Stream[] } = {};

    const files = await fs.promises.readdir(directoryPath);

    for (const file of files) {
        const filePath = path.join(directoryPath, file);

        const stats = await fs.promises.stat(filePath);

        if (stats.isFile()) {
            const fileTimeStamp = createDateFromString(extractTimestampFromFilename(filePath));
            const streamsResponse: Stream[] = await readJsonFile<Stream[]>(filePath);
            streamsResponse.forEach(streamResponse => {
                if (streamResponse.user_id && !streamResponseFromAllDay[streamResponse.user_id]) {
                    streamResponseFromAllDay[streamResponse.user_id] = [];
                }
                streamResponse.timeStamp = fileTimeStamp;
                streamResponseFromAllDay[streamResponse.user_id].push(streamResponse);
            });
        } else {
            console.log("Destination is not a file: ", stats);
        }
    }

    return streamResponseFromAllDay;
}

function createDateFromString(timestamp: string): Date {
    const year = timestamp.slice(0, 4);
    const month = timestamp.slice(4, 6);
    const day = timestamp.slice(6, 8);
    const time = timestamp.slice(9, 15);
    const milliseconds = timestamp.slice(15, 18);

    const formattedTime = `${time.slice(0, 2)}:${time.slice(2, 4)}:${time.slice(4, 6)}`;

    const isoString = `${year}-${month}-${day}T${formattedTime}.${milliseconds}Z`;

    return new Date(isoString);
}


export function calculateSummaries(streamMap: StreamMap): void {
    for (const streamerID in streamMap) {
        if (streamMap.hasOwnProperty(streamerID)) {
            const streams = streamMap[streamerID];
            const { peakViewers } = calculateStatistics(streams);
        }
    }
}

type StreamerStatistics = {
    watchHours: number,
    avgViewers: number,
    peakViewers: number
}

export function calculateStatistics(streams: Stream[]): StreamerStatistics {
    let watchHours = 0;
    let avgViewers = 0;
    let peakViewers = 0;
    let hours = 0;
    let lastTimeStamp = undefined;
    for (const stream of streams) {
        peakViewers = calculatePeakViewersStrategy(stream.viewer_count, peakViewers);
        avgViewers = calculateAvgViewersStrategy(stream, avgViewers);
        watchHours = calculateWatchHoursStrategy(stream, watchHours, lastTimeStamp);
    }

    return {watchHours, avgViewers, peakViewers};
}

export function calculatePeakViewersStrategy(currentViewersCount: number, peakViewersCount: number): number {
    return currentViewersCount > peakViewersCount ? currentViewersCount : peakViewersCount;
}

export function calculateAvgViewersStrategy(stream: Stream, oldAvgViewers: number) : number {
    if (oldAvgViewers === 0) return stream.viewer_count;
    else {

    }
    return 0
}

export function calculateWatchHoursStrategy(stream: Stream, watchHours: number, lastTimeStamp: Date | undefined) : number {
    return 0
}