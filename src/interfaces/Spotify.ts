import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

export interface SpotifyUser {
	country: string;
	display_name: string;
	email: string;
	explicit_content: {
	filter_enabled: boolean;
	filter_locked: boolean;
	};
	external_urls: {
	spotify: string;
	};
	followers: {
	href: string;
	total: number;
	};
	href: string;
	id: string;
	images: Array<{
	url: string;
	height: number;
	width: number;
	}>;
	product: string;
	type: string;
	uri: string;
}

export interface SpotifyToken extends JWT {
	accessToken: string;
	refreshToken: string;
	expiresAt: number;
	providerAccountId: string;
	error?: string;
}

export interface TokenSession {
	user: {
	  name: string | null
	  email: string | null
	}
	token: SpotifyToken
}

export interface SpotifySearchResponse {
	tracks: PaginatedResponse<Track>;
	artists: PaginatedResponse<Artist>;
	albums: PaginatedResponse<Album>;
	playlists: PaginatedResponse<Playlist>;
	shows: PaginatedResponse<Show>;
	episodes: PaginatedResponse<Episode>;
  }
  
export interface PaginatedResponse<T> {
	href: string;
	limit: number;
	next: string | null;
	offset: number;
	previous: string | null;
	total: number;
	items: T[];
  }
  
export interface Track {
	album: Album;
	artists: Artist[];
	available_markets: string[];
	disc_number: number;
	duration_ms: number;
	explicit: boolean;
	external_ids: {
	  isrc: string;
	  ean: string;
	  upc: string;
	};
	external_urls: ExternalUrls;
	href: string;
	id: string;
	is_playable: boolean;
	linked_from: Record<string, unknown>;
	restrictions?: Restrictions;
	name: string;
	popularity: number;
	preview_url: string;
	track_number: number;
	type: string;
	uri: string;
	is_local: boolean;
  }
  
export interface Album {
	album_type: string;
	total_tracks: number;
	available_markets: string[];
	external_urls: ExternalUrls;
	href: string;
	id: string;
	images: Image[];
	name: string;
	release_date: string;
	release_date_precision: string;
	restrictions?: Restrictions;
	type: string;
	uri: string;
	artists: Artist[];
  }
  
export interface Artist {
	external_urls: ExternalUrls;
	href: string;
	id: string;
	name: string;
	type: string;
	uri: string;
	followers?: {
	  href: string | null;
	  total: number;
	};
	genres?: string[];
	images?: Image[];
	popularity?: number;
  }
  
  interface Playlist {
	collaborative: boolean;
	description: string;
	external_urls: ExternalUrls;
	href: string;
	id: string;
	images: Image[];
	name: string;
	owner: {
	  external_urls: ExternalUrls;
	  href: string;
	  id: string;
	  type: string;
	  uri: string;
	  display_name: string;
	};
	public: boolean;
	snapshot_id: string;
	tracks: {
	  href: string;
	  total: number;
	};
	type: string;
	uri: string;
  }
  
  interface Show {
	available_markets: string[];
	copyrights: {
	  text: string;
	  type: string;
	}[];
	description: string;
	html_description: string;
	explicit: boolean;
	external_urls: ExternalUrls;
	href: string;
	id: string;
	images: Image[];
	is_externally_hosted: boolean;
	languages: string[];
	media_type: string;
	name: string;
	publisher: string;
	type: string;
	uri: string;
	total_episodes: number;
  }
  
  interface Episode {
	audio_preview_url: string;
	description: string;
	html_description: string;
	duration_ms: number;
	explicit: boolean;
	external_urls: ExternalUrls;
	href: string;
	id: string;
	images: Image[];
	is_externally_hosted: boolean;
	is_playable: boolean;
	language: string;
	languages: string[];
	name: string;
	release_date: string;
	release_date_precision: string;
	resume_point?: {
	  fully_played: boolean;
	  resume_position_ms: number;
	};
	type: string;
	uri: string;
  }
  
  interface ExternalUrls {
	spotify: string;
  }
  
  interface Restrictions {
	reason: string;
  }
  
  interface Image {
	url: string;
	height: number;
	width: number;
  }
  