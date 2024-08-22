import * as fs from 'fs';
import * as path from 'path';
import { extractTimestampFromFilename, readJsonFile } from "../utils/file-utils";
import { Stream } from '../model/GetStreamsResponse';

interface StreamMap {
    [streamerID: string]: Stream[];
}

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
                streamResponse.timeStamp = fileTimeStamp;
                streamResponseFromAllDay[user_id].push(streamResponse);
            }
        });
    }));

    return streamResponseFromAllDay;
}

function createDateFromString(timestamp: string): Date {
    const year = timestamp.slice(0, 4);
    const month = timestamp.slice(4, 6);
    const day = timestamp.slice(6, 8);
    const time = timestamp.slice(9, 15);
    const milliseconds = timestamp.slice(15, 18);

    const isoString = `${year}-${month}-${day}T${time.slice(0, 2)}:${time.slice(2, 4)}:${time.slice(4, 6)}.${milliseconds}Z`;

    return new Date(isoString);
}

export function calculateSummaries(streamMap: StreamMap): void {
    Object.keys(streamMap).forEach(streamerID => {
        const streams = streamMap[streamerID];
        const { peakViewers } = calculateStatistics(streams);
    });
}

type StreamerStatistics = {
    watchHours: number;
    avgViewers: number;
    peakViewers: number;
}

export function calculateStatistics(streams: Stream[]): StreamerStatistics {
    let watchHours = 0;
    let avgViewers = 0;
    let peakViewers = 0;
    let prevStream: Stream | undefined;

    streams.forEach(stream => {
        peakViewers = calculatePeakViewersStrategy(stream.viewer_count, peakViewers);
        avgViewers = calculateAvgViewersStrategy(stream, avgViewers);
        watchHours += calculateWatchHoursStrategy(stream, prevStream);
        prevStream = stream;
    });

    return { watchHours, avgViewers, peakViewers };
}

export function calculatePeakViewersStrategy(currentViewersCount: number, peakViewersCount: number): number {
    return Math.max(currentViewersCount, peakViewersCount);
}

export function calculateAvgViewersStrategy(stream: Stream, oldAvgViewers: number): number {
    return 0;
}

export function calculateWatchHoursStrategy(
    stream: Stream,
    previousStream?: Stream
): number {
    /* 
        if previousStream is not present
            calculate minutesDiff stream.timestamp - stream.started_at

        if previousStream is present
            if (stream.startedAt > previousStream.timestamp)
                calculate minutesDiff stream.timestamp - stream.startedAt
            else {
                   calculate minutesDiff stream.timestamp - previousStream.timestamp
                }
    */
    const minutesDiff = previousStream // TODO what if streamer was offline, what if streamer haven't streamed. need to checkk when was live last time
        ? minutesBetweenDates(previousStream.timeStamp, stream.timeStamp)
        : minutesSinceMidnight(stream.timeStamp!);
    return ( Math.abs(minutesDiff) / 60) * stream.viewer_count;
}

function minutesSinceMidnight(date: Date): number {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return hours * 60 + minutes;
}

function minutesBetweenDates(firstDate: Date, secondDate: Date): number {
    const milliDiff = firstDate.getTime() - secondDate.getTime();
    return milliDiff / (1000 * 60);
}
