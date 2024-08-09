import { fetchDataFromTwitch } from './twitch/DataFetcher';

async function main() {
    console.log("Fetching database task is running...");
    fetchDataFromTwitch();
    console.log("Task completed!");
}

main();