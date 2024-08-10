export const config = {
    maxRequests: 10, // Maximum number of requests to be made during one batch
    minViewerCount: 5, // Minimuym number of viewers to be included
    language: 'pl', // Language filter for streams
    first: 32, // Number of streams to fetch per request -- 10.08.2024 32 is the maximum
    directory: '/kickDir',
    maxRetries: 5,
    RETRY_DELAY_MS: 1000
};