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