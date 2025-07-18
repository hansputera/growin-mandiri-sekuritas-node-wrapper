import { GROWIN_API_BASE_URL } from '@/constants/index.js';
import got from 'got';

export const apiHttpClient = got.extend({
	prefixUrl: GROWIN_API_BASE_URL,
	headers: {
		'User-Agent':
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
		Origin: 'https://invest.growin.id',
		Referer: 'https://invest.growin.id/',
	},
});
