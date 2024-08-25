import { Stream } from "../model/TwitchStreams";

export type StreamersStatistics = {
    streamerId: string;
    streamerLogin: string;
    streamerName: string;
    statistics: StreamerStatistics
}

// TODO you get the idea, make this have more sense 
// export interface StreamerInfo2<T> {
//     streamerName: string;
//     statistics: StreamerStatistics;
//     info: T
// }

// export interface TwitchInto {
//     streamerLogin: string;
//     streamerName: string;
// }

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