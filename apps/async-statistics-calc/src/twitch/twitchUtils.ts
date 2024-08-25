import { Stream } from "../model/TwitchStreams";
import { StreamersStatistics, StreamerInfo, StreamerStatistics } from "./types";

export function calculateSummaries(streamMap: StreamMap): StreamersStatistics[] {
    return Object.keys(streamMap).map(streamerID => {
        const streams = streamMap[streamerID];
        const statistics = calculateStatistics(streams);
        const info = extractStreamerInfo(streams[0]);
        
        return { 
            streamerId: info.streamerId,
            streamerLogin: info.streamerLogin,
            streamerName: info.streamerName,
            statistics 
        };
    });
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

    streams.forEach(stream => {
        peakViewers = Math.max(stream.viewer_count, peakViewers);
        totalViewers += stream.viewer_count;

        watchHours += calculateWatchHours(stream, previousStream);
        previousStream = stream;
    });

    return {
        watchHours,
        avgViewers: totalViewers / streams.length || 0,
        peakViewers
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