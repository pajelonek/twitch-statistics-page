interface GetStreamsResponse {
    current_page: number;
    data: StreamData[];
    first_page_url: string;
    from: number;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
  }
  
  interface StreamData {
    id: number;
    slug: string;
    channel_id: number;
    created_at: string;
    session_title: string;
    is_live: boolean;
    risk_level_id: number | null;
    start_time: string;
    source: string | null;
    twitch_channel: string | null;
    duration: number;
    language: string;
    is_mature: boolean;
    viewer_count: number;
    order: number | null;
    thumbnail: Thumbnail;
    viewers: number;
    channel: Channel;
    categories: Category[];
  }
  
  interface Thumbnail {
    srcset: string;
    src: string;
  }
  
  interface Channel {
    id: number;
    user_id: number;
    slug: string;
    is_banned: boolean;
    playback_url: string;
    name_updated_at: string | null;
    vod_enabled: boolean;
    subscription_enabled: boolean;
    can_host: boolean;
    user: User;
  }
  
  interface User {
    id: number;
    username: string;
    agreed_to_terms: boolean;
    email_verified_at: string;
    bio: string;
    country: string | null;
    state: string | null;
    city: string | null;
    instagram: string | null;
    twitter: string | null;
    youtube: string | null;
    discord: string | null;
    tiktok: string | null;
    facebook: string | null;
    profilepic: string;
  }
  
  interface Category {
    id: number;
    category_id: number;
    name: string;
    slug: string;
    tags: string[];
    description: string | null;
    deleted_at: string | null;
    viewers: number;
    category: CategoryDetails;
  }
  
  interface CategoryDetails {
    id: number;
    name: string;
    slug: string;
    icon: string;
  }