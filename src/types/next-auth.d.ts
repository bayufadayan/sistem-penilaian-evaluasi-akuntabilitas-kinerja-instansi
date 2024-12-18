import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
	interface User extends DefaultUser {
		role?: string;
		accessToken?: string;
	}

	interface Session {
		user: {
			id?: string;
			email?: string;
			name?: string;
			role?: string;
			accessToken?: string; 
		} & DefaultSession["user"];
	}

	interface JWT {
		email?: string;
		name?: string;
		role?: string;
		accessToken?: string;
	}
}
