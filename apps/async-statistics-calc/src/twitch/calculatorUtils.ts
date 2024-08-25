import { Stream } from "../model/TwitchStreams";
import { StreamersStatistics, StreamerStatistics, StreamerInfo, StreamMap } from "./types";


export function calculateSummaries(streamMap: StreamMap): StreamersStatistics[] {
    return Object.keys(streamMap).map(streamerID => {
        const streams = streamMap[streamerID];
        const statistics: StreamerStatistics = calculateStatistics(streams);
        const info: StreamerInfo = enhanceStatistics(streams[0]);
        
        return { statistics, 
            streamerId: info.streamerId,
            streamerLogin: info.streamerLogin,
            streamerName: info.streamerName
        };
    });
}

function enhanceStatistics(stream: Stream): StreamerInfo {
    return {
        streamerId: stream.user_id,
        streamerLogin: stream.user_login,
        streamerName: stream.user_name
    }
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
    let minutesDiff;
    if (previousStream) {
        if (stream.started_at > previousStream.timeStamp)
            minutesDiff = minutesBetweenDates(stream.timeStamp, stream.started_at)
        else {
            minutesDiff = minutesBetweenDates(stream.timeStamp, previousStream.timeStamp)
            }
    } else {
        minutesDiff = minutesBetweenDates(stream.timeStamp, stream.started_at)
    }
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
