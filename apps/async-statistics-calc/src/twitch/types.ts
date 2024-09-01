import { Stream } from "../model/TwitchStreams";

export type StreamersStatistics = {
    streamerId: string;
    streamerLogin: string;
    streamerName: string;
    statistics: StreamerStatistics
}

export type StreamerInfo = {
    streamerId: string;
    streamerLogin: string;
    streamerName: string;
}

export type StreamerStatistics = {
    watchHours: number;
    avgViewers: number;
    peakViewers: number;
}

export type StreamMap = { [streamerID: string]: Stream[] };