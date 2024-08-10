import * as dotenv from 'dotenv';

import axios from "axios";
import { AuthResponse } from "./model/TokenResponse";
import { GetStreamsResponse, Stream } from "./model/GetStreamsResponse";
import { config } from '../config/twitchApiConfig';

dotenv.config();

export async function getAuthToken(): Promise<string> {
    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;
    const grantType = 'client_credentials';

    if (!clientId || !clientSecret) {
        throw new Error('TWITCH_CLIENT_ID or TWITCH_CLIENT_SECRET is not set');
    }

    try {
        const url = `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=${grantType}`;
        const response = await axios.post<AuthResponse>(url);

        if (response.status === 200) {
            const data = response.data as AuthResponse;

            if (data.access_token && data.expires_in && data.token_type) {
                return data.access_token;
            } else {
                throw new Error('Response data does not match AuthResponse structure');
            }
        } else {
            console.error(`Unexpected status code: ${response.status}`);
            throw new Error(`Failed to fetch auth token, status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching auth token:', error);
        throw error;
    }
}

export async function getStreams(token: string, pagination?: string): Promise<GetStreamsResponse> {
    let url = `https://api.twitch.tv/helix/streams?first=${config.first}&language=${config.language}`;
    const clientId = process.env.TWITCH_CLIENT_ID;
    const accessToken = token;

    url = pagination ? `${url}&after=${pagination}` : url;

    try {
        const response = await axios.get<GetStreamsResponse>(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Client-Id': clientId
            }
        });

        if (response.status === 200) {
            return response.data;
        } else {
            console.error(`Unexpected status code: ${response.status}`);
            throw new Error(`Failed to fetch stream data, status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching stream data:', error);
        throw error;
    }
}