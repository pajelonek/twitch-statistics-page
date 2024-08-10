import { getStreams } from "./RestClient";
import { config } from '../config/kickApiConfig';
import { getTimestamp } from "../file/utils";
import * as fs from 'fs';
import * as path from 'path';

export async function fetchDataFromKick() {
    const streams = await getAllStreams();
    const utilizedStreams = cleanStreamData(streams);
    saveStreamsToFileWithTimestamp(utilizedStreams);
}

export async function getAllStreams(): Promise<StreamData[]> {
    let allStreams: StreamData[] = [];
    let pageNumber = 1;
    let maxPages = config.maxRequests;

    while (pageNumber < maxPages) {
        try {
            const response = await getStreams(pageNumber);
            const isMinimumViewerCountReached = response.data.length > 0 && response.data[0].viewer_count < config.minViewerCount
            if (isMinimumViewerCountReached) {
                break;
            }
            
            allStreams = allStreams.concat(response.data);

            pageNumber++;
        } catch (error) {
            console.error('Error fetching kick stream data:', error);
            break;
        }
    }
    console.log('Numbers of kick pages fetched ', pageNumber);
    console.log('Streams kick fetched ', allStreams.length);
    return allStreams;
}

function cleanStreamData(streams: StreamData[]): StreamData[] {
    return streams.filter((stream, index, self) =>
        index === self.findIndex((t) => t.channel_id === stream.channel_id) &&
        stream.viewer_count >= config.minViewerCount
    );
}

async function saveStreamsToFileWithTimestamp(streams: StreamData[]): Promise<void> {
    const timestampedFilePath = path.join(__dirname + '/' + config.directory, getTimestamp());

    const dir = path.dirname(timestampedFilePath);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const data = JSON.stringify(streams, null, 2);

    await fs.promises.writeFile(timestampedFilePath, data, 'utf8');

    console.log(`Successfully saved streams to ${timestampedFilePath}`);
}