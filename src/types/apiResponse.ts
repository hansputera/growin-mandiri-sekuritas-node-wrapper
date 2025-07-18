export type APIResponse<Data> = {
	data: Data;
};

export namespace APIResponses {
	export type LoginResponse = APIResponse<{
		refresh_token: string;
		refresh_token_exp: number;
		refresh_token_exp_in_sec: number;
		token: string;
		token_exp: number;
		token_exp_in_sec: number;
		is_temporary_password: boolean;
		is_password_expired: boolean;
	}>;
}
