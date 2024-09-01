import * as fs from 'fs';
import * as path from 'path';
import { Stream } from "../model/TwitchStreams";
import { createDateFromString, extractTimestampFromFilename, readJsonFile } from "../utils/fileUtils";
import { StreamersStatistics, StreamerInfo, StreamerStatistics, StreamMap } from "./types";

export async function readAllStreamsFromDirectory(directoryPath: string): Promise<StreamMap> {
    const streamResponseFromAllDay: StreamMap = {};
    const files = await fs.promises.readdir(directoryPath);

    await Promise.all(files.map(async (file) => {
        const filePath = path.join(directoryPath, file);
        const stats = await fs.promises.stat(filePath);

        if (!stats.isFile()) {
            console.log("Destination is not a file: ", stats);
            return;
        }

        const fileTimeStamp = createDateFromString(extractTimestampFromFilename(filePath));
        const streamsResponse: Stream[] = await readJsonFile<Stream[]>(filePath);

        streamsResponse.forEach(streamResponse => {
            const { user_id } = streamResponse;

            if (user_id) {
                streamResponseFromAllDay[user_id] ||= [];
                streamResponse.started_at = new Date(streamResponse.started_at)
                streamResponse.timeStamp = fileTimeStamp;
                streamResponseFromAllDay[user_id].push(streamResponse);
            }
        });
    }));

    return streamResponseFromAllDay;
}

function extractStreamerInfo(stream: Stream): StreamerInfo {
    return {
        streamerId: stream.user_id,
        streamerLogin: stream.user_login,
        streamerName: stream.user_name
    };
}

export function calculateStatistics(streams: Stream[]): StreamerStatistics {
    let watchHours = 0;
    let totalViewers = 0;
    let peakViewers = 0;
    let previousStream: Stream | undefined;
    let streamedHours = 0;
    streams.forEach(stream => {
        peakViewers = Math.max(stream.viewer_count, peakViewers);
        totalViewers += stream.viewer_count;
        watchHours += calculateWatchHours(stream, previousStream);
        previousStream = stream;
    });

    return {
        watchHours,
        avgViewers: totalViewers / streams.length || 0,
        peakViewers,
        streamedHours
    };
}

function calculateWatchHours(stream: Stream, previousStream?: Stream): number {
    const minutesDiff = previousStream
        ? minutesBetweenDates(previousStream.timeStamp, stream.started_at)
        : minutesBetweenDates(stream.timeStamp, stream.started_at);

    return (Math.abs(minutesDiff) / 60) * stream.viewer_count;
}

function minutesBetweenDates(startDate: Date, endDate: Date): number {
    const milliDiff = endDate.getTime() - startDate.getTime();
    return milliDiff / (1000 * 60);
}