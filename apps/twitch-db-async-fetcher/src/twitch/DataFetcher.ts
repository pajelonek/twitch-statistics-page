import { GetStreamsResponse, Stream } from "./model/GetStreamsResponse";
import { getAuthToken, getStreams } from "./RestClient";
import { config } from '../config/twitchApiConfig';

export async function fetchDataFromTwitch() {
    const token = await getAuthToken();
    const streams = await getAllStreams(token);

}

interface PreparedStreamersData {
    [streamerId: string]: StreamerData;
}
  
interface StreamerData {
    timestamp: string;
    viewerCount: number;
}
  

function prepareData(streams: GetStreamsResponse) {
    streams.data.forEach((stream: Stream) => {
            // check if file exists
            // add to a file for each streamer where file should have name of stream.user_id
      });
}

export async function getAllStreams(token: string): Promise<Stream[]> {
    let allStreams: Stream[] = [];
    let pagination: string | undefined;
    let pageCount = 0;
    let maxPages = config.maxRequests;
    
    while (pageCount < maxPages) {
        try {
            const response = await getStreams(token, pagination);
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
