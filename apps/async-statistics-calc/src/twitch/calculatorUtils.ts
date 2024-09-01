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
    let streamedHours = 0;

    streams.forEach(stream => {
        peakViewers = calculatePeakViewersStrategy(stream.viewer_count, peakViewers);
        avgViewers = calculateAvgViewersStrategy(stream, prevStream, avgViewers, streamedHours);
        watchHours += calculateWatchHoursStrategy(stream, prevStream);
        streamedHours += calculateStreamHoursStrategy(stream, prevStream)
        prevStream = stream;
    });

    return { watchHours, avgViewers, peakViewers, streamedHours };
}

export function calculatePeakViewersStrategy(currentViewersCount: number, peakViewersCount: number): number {
    return Math.max(currentViewersCount, peakViewersCount);
}

export function calculateAvgViewersStrategy(stream: Stream, previousStream: Stream | undefined, oldAvgViewers: number, oldHoursStreamed: number): number {
    let minutesDiff;
    if (!previousStream) return stream.viewer_count;

    if (stream.started_at > previousStream.timeStamp) {
        minutesDiff = minutesBetweenDates(stream.timeStamp, stream.started_at);
    }
    else {
        minutesDiff = minutesBetweenDates(stream.timeStamp, previousStream.timeStamp);
    }
    return ((oldAvgViewers * oldHoursStreamed) + (stream.viewer_count * (minutesDiff / 60))) / (oldHoursStreamed +  (minutesDiff / 60));
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

export function calculateStreamHoursStrategy(
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
    return Math.abs(minutesDiff) / 60;
}

function minutesBetweenDates(firstDate: Date, secondDate: Date): number {
    const milliDiff = firstDate.getTime() - secondDate.getTime();
    return milliDiff / (1000 * 60);
}

export function updateSummaries(existingSummaries: StreamersStatistics[], newSummaries: StreamersStatistics[]): StreamersStatistics[] {
    const summaryMap = new Map<string, StreamersStatistics>();
  
    existingSummaries.forEach(summary => {
      summaryMap.set(summary.streamerId, summary);
    });
  
    newSummaries.forEach(newSummary => {
        if (summaryMap.has(newSummary.streamerId)) {
            let streamerStatistics = summaryMap.get(newSummary.streamerId)!;
            const newStatistics = mergeStreamerStatistics(streamerStatistics, newSummary);
            summaryMap.set(newSummary.streamerId, newStatistics);
        }
        else {
            summaryMap.set(newSummary.streamerId, newSummary);
        }
    });
  
    return Array.from(summaryMap.values());
}

export function mergeStreamerStatistics(
    currentStatistics: StreamersStatistics,
    newStatistics: StreamersStatistics
  ): StreamersStatistics {
    const currentStats = currentStatistics.statistics;
    const newStats = newStatistics.statistics;
  
    currentStats.peakViewers = Math.max(currentStats.peakViewers, newStats.peakViewers);
    currentStats.watchHours += newStats.watchHours;
    currentStats.streamedHours += newStats.streamedHours;
    
    currentStats.avgViewers =
      (currentStats.avgViewers * currentStats.streamedHours + newStats.avgViewers * newStats.streamedHours) /
      (currentStats.streamedHours + newStats.streamedHours);
  
    return currentStatistics;
  }
