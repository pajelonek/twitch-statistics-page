export interface Stream {
    id: string;
    user_id: string;
    user_login: string;
    user_name: string;
    game_id: string;
    game_name: string;
    type: string;
    title: string;
    viewer_count: number;
    started_at: string;
    language: string;
    thumbnail_url: string;
    tag_ids: Array<string>;
    tags: Array<string>;
    is_mature: boolean;
}

export interface Pagination {
    cursor?: string;
}

export interface GetStreamsResponse {
    data: Array<Stream>;
    pagination: Pagination;
}
