import { apiHttpClient } from '@/http/apiHttp.js';
import type { StoreBase } from '@/stores/storeBase.js';
import type {
	AccountManagerConstructorParams,
	AccountManagerUserData,
} from '@/types/accountManager.js';
import type { APIResponses } from '@/types/apiResponse.js';
import type { ToughCookieJar } from 'got';
import { CookieJar } from 'tough-cookie';

/**
 * @class AccountManager
 */
export class AccountManager {
	/**
	 * @private
	 * Used to store account data
	 */
	#store: StoreBase<AccountManagerUserData>;

	/**
	 * @constructor
	 * @param accountParams Required parameters on Account Manager
	 */
	constructor(protected accountParams: AccountManagerConstructorParams) {
		this.#store = accountParams.store;
	}

	/**
	 * Check if the current user account token has expired by using their saved expiredIn data
	 * @return {Promise<boolean>}
	 */
	protected async hasExpiredToken(): Promise<boolean> {
		const expiredIn = await this.#store.get('loggedAt');
		return Date.now() >= expiredIn;
	}

	/**
	 * Generate cookies using current access and refresh token
	 * @return {Promise<ToughCookieJar>}
	 */
	public async generateCookies(): Promise<ToughCookieJar> {
		const userAccessToken = await this.#store.get('accessToken');
		const userRefreshToken = await this.#store.get('refreshToken');

		const cookieJar = new CookieJar();
		cookieJar.setCookie(
			`ACCESS_TOKEN=${userAccessToken}; Path=/; Max-Age=21600; HttpOnly; Secure; SameSite=None`,
			apiHttpClient.defaults.options.prefixUrl,
		);
		cookieJar.setCookie(
			`REFRESH_TOKEN=${userRefreshToken}; Path=/; Max-Age=21600; HttpOnly; Secure; SameSite=None`,
			apiHttpClient.defaults.options.prefixUrl,
		);

		return cookieJar;
	}

	/**
	 * Logging in to Growin Mandiri Sekuritas API using given username and password
	 * @return {Promise<void>}
	 */
	public async login(): Promise<void> {
		// Check if the account has expired or no
		const isExpiredToken = await this.hasExpiredToken();

		// If the account token has expired
		if (isExpiredToken) {
			// Fetch to API
			const response = await apiHttpClient
				.post('./auth/api/v1/login', {
					json: {
						userId: this.accountParams.username,
						password: this.accountParams.password,
						recaptcha: 'mobile',
					},
				})
				.json<APIResponses.LoginResponse>();

			// Write response data to store
			await this.#store.setState({
				accessToken: {
					expireIn: response.data.token_exp,
					expireInSec: response.data.token_exp_in_sec,
					token: response.data.token,
				},
				refreshToken: {
					expireIn: response.data.refresh_token_exp,
					expireInSec: response.data.refresh_token_exp_in_sec,
					token: response.data.refresh_token,
				},
				loggedAt: Date.now(),
				isPasswordExpired: response.data.is_password_expired,
				isTemporaryPassword: response.data.is_temporary_password,
			});
		}
	}
}
