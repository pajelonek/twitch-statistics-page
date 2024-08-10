import { Stream } from "./model/GetStreamsResponse";
import { getAuthToken, getStreams } from "./RestClient";
import { config } from '../config/twitchApiConfig';
import { getTimestamp } from "../file/utils";
import * as fs from 'fs';
import * as path from 'path';

export async function fetchDataFromTwitch() {
    const token = await getAuthToken();
    const streams = await getAllStreams(token);
    const utilizedStreams = cleanStreamData(streams);
    await saveStreamsToFileWithTimestamp(utilizedStreams);
}

export async function getAllStreams(token: string): Promise<Stream[]> {
    let allStreams: Stream[] = [];
    let pagination: string | undefined;
    let pageCount = 0;
    let maxPages = config.maxRequests;

    while (pageCount < maxPages) {
        try {
            const response = await getStreams(token, pagination);
            
            
            const isMinimumViewerCountReached = response.data.length > 0 && response.data[0].viewer_count < config.minViewerCount
            if (isMinimumViewerCountReached) {
                break;
            }
            
            allStreams = allStreams.concat(response.data);

            if (response.pagination && response.pagination.cursor) {
                pagination = response.pagination.cursor;
            } else {
                break;
            }

            pageCount++;
        } catch (error) {
            console.error('Error fetching stream data:', error);
            break;
        }
    }
    console.log('Numbers of pages fetched', pageCount);
    console.log('Streams fetched', allStreams.length);
    return allStreams;
}


function cleanStreamData(streams: Stream[]): Stream[] {
    return streams.filter((stream, index, self) =>
        index === self.findIndex((t) => t.user_id === stream.user_id) &&
        stream.viewer_count >= config.minViewerCount
    );
}


async function saveStreamsToFileWithTimestamp(streams: Stream[]): Promise<void> {
    const timestampedFilePath = path.join(__dirname + '/' + config.directory, getTimestamp());

    const dir = path.dirname(timestampedFilePath);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const data = JSON.stringify(streams, null, 2);

    await fs.promises.writeFile(timestampedFilePath, data, 'utf8');

    console.log(`Successfully saved streams to ${timestampedFilePath}`);
}