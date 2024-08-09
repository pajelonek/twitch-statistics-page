import { getAuthToken, getStreams } from "./RestClient";

export async function fetchDataFromTwitch() {
    const token = await getAuthToken();
    getStreams(token);
}