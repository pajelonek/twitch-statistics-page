import axios, { HttpStatusCode } from "axios";
import { config } from '../config/kickApiConfig';
import { retry, RetryOptions } from "ts-retry";

var cloudscraper = require('cloudscraper');

const RETRY_OPTIONS: RetryOptions = {
    maxTry: config.maxRetries,
    delay: config.RETRY_DELAY_MS,
    onError: (error: any) => {
        console.warn(`Attempt failed. Retrying... Error: ${error.message}`);
    }
};

export async function getStreams(page?: number): Promise<GetStreamsResponse> {
    let url = `https://kick.com/stream/livestreams/${config.language}?limit=${config.first}&subcategory=&sort=desc&strict=true`;

    url = page ? `${url}&page=${page}` : url;

    const fetchWithRetry = async (): Promise<string> => {
        return await new Promise<string>((resolve, reject) => {
            cloudscraper.get(url, (error: any, response: any, body: any) => {
                if (error) {
                    reject(new Error(`Request failed: ${error.message}`));
                }
                
                if (response.statusCode === HttpStatusCode.NotModified || response.statusCode === HttpStatusCode.Ok) {
                    resolve(body);
                } else {
                    reject(new Error(`Incorrect status code: ${response.statusCode}`));
                }
            });
        });

    };

    try {
        const result = await retry(fetchWithRetry, RETRY_OPTIONS);
        return JSON.parse(result) as GetStreamsResponse;
    } catch (error) {
        console.error('Final error after retries:', error);
        throw error;
    }
}