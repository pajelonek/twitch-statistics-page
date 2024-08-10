import { fetchDataFromKick } from './kick/DataFetcher';
import { fetchDataFromTwitch } from './twitch/DataFetcher';

async function main() {
    console.log("Fetching database task is running...");
    await fetchDataFromTwitch();
    await fetchDataFromKick();
    console.log("Task completed!");
}

main();