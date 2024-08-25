export interface Stream {
    id: string;
    user_id: string;
    user_login: string;
    user_name: string;
    started_at: Date;
    game_id: string;
    game_name: string;
    type: string;
    title: string;
    viewer_count: number;
    language: string;
    thumbnail_url: string;
    tag_ids: string[];
    tags: string[];
    is_mature: boolean;
    timeStamp: Date
}

export interface Pagination {
    cursor?: string;
}

export interface Streams {
    data: Stream[];
    pagination: Pagination;
}

export interface StreamsSummary {
    streamerMap: { [streamerID: string]: Stream[] };
}
