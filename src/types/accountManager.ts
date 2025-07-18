import type { StoreBase } from '@/stores/storeBase.js';

export type AccountManagerConstructorParams = {
	username: string;
	password: string;
	store: StoreBase<AccountManagerUserData>;
};

export type AccountManagerToken = {
	token: string;
	expireIn: number;
	expireInSec: number;
};

export type AccountManagerUserData = {
	accessToken: AccountManagerToken;
	refreshToken: AccountManagerToken;
	isPasswordExpired: boolean;
	isTemporaryPassword: boolean;
	loggedAt: number;
};
