import * as fs from 'fs';
import * as path from 'path';
import { readJsonFile } from "../utils/file-utils";
import { Stream } from '../model/GetStreamsResponse';
import { StreamerSummary } from '../model/StreamerSummary';

interface StreamMap { 
    [streamerID: string]: Stream[] 
};

interface SummaryMap { 
    [streamerID: string]: StreamerSummary[] 
};

export async function readAllStreamsFromDirectory(directoryPath: string): Promise<StreamMap> {
    const streamResponseFromAllDay: { [streamerID: string]: Stream[] } = {};

    const files = await fs.promises.readdir(directoryPath);

    for (const file of files) {
        const filePath = path.join(directoryPath, file);

        const stats = await fs.promises.stat(filePath);

        if (stats.isFile()) {
            const streamsResponse: Stream[] = await readJsonFile<Stream[]>(filePath);
            streamsResponse.forEach(streamResponse => {
                if (streamResponse.user_id && !streamResponseFromAllDay[streamResponse.user_id]) {
                    streamResponseFromAllDay[streamResponse.user_id] = [];
                }
                streamResponseFromAllDay[streamResponse.user_id].push(streamResponse);
            });
        } else {
            console.log("Destination is not a file: ", stats);
        }
    }

    return streamResponseFromAllDay;
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

    for (const stream of streams) {
        if (stream.viewer_count > peakViewers) peakViewers = stream.viewer_count
    }

    return {watchHours, avgViewers, peakViewers};
}