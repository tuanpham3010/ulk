const fs = require('fs');
const path = require('path');
const process = require('process');
// const http = require('http');
// const url = require('url');
// const destroyer = require('server-destroy');
const { google } = require('googleapis');
const Logger = require('@/libs/common/logger.service');

// If modifying these scopes, delete token.json.
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'config/google.token.json');
const CREDENTIALS_PATH = path.join(
	process.cwd(),
	'config/credentials.config.json'
);
const GMAIL_CONFIG_PATH = path.join(process.cwd(), 'config/google.config.json');
const TOPIC_NAME =
	'projects/project-01-gmail-webhook/topics/GmailIncomingEmail';
const SCOPES = [
	'https://www.googleapis.com/auth/gmail.readonly',

	// 'https://www.googleapis.com/auth/gmail.modify',
];

class GoogleApiConfig {
	constructor() {
		const { client_id, client_secret, redirect_uris } =
			require(GMAIL_CONFIG_PATH).web;
		this.oauth2Client = new google.auth.OAuth2(
			client_id,
			client_secret,
			redirect_uris[0]
		);
		this.start();
	}

	GMAIL_CONFIG_PATH = path.join(process.cwd(), 'config/google.config.json');
	googleGmail = null;
	CREDENTIALS_PATH = path.join(
		process.cwd(),
		'config/credentials.config.json'
	);
	TOPIC_NAME = 'projects/project-01-gmail-webhook/topics/GmailIncomingEmail';
	SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
	listenToken = () => {
		this.oauth2Client.on('tokens', (tokens) => {
			this.saveCredentials(tokens);
			if (tokens.refresh_token) {
				// store the refresh_token in my database!
				console.log(tokens.refresh_token);
			}
		});
	};
	getAuthorizationUrl = () => {
		return this.oauth2Client.generateAuthUrl({
			// 'online' (default) or 'offline' (gets refresh_token)
			access_type: 'offline',
			scope: this.SCOPES,
			// include_granted_scopes: true,
		});
	};
	setGoogleGmail = async (code) => {
		await this.getAcessToken(code);
		this.connectPubSub();
		Logger.writeLog('info', {
			message: 'success set up googleGmail',
		});
	};
	getGoogleGmail = () => {
		return this.googleGmail;
	};
	watchGmail = async () => {
		try {
			return await this.googleGmail.users.watch({
				userId: 'me',
				requestBody: {
					labelIds: ['INBOX'],
					topicName: this.TOPIC_NAME,
				},
			});
		} catch (error) {
			console.log(error);
		}
	};
	setCredentialsOauth(credentials) {
		this.oauth2Client.setCredentials(credentials);
	}
	async getAcessToken(code) {
		try {
			const data = await this.oauth2Client.getToken(code);
			const { tokens } = data;
			// oauth2Client.credentials = tokens;
			this.saveCredentials(tokens);
			this.setCredentialsOauth({
				...tokens,
				// expiry_date: tokens.expiry_date,
			});
			console.log('success set up googleGmail');
		} catch (error) {
			console.log(error);
		}
	}
	resetGoogleGmail = () => {
		this.googleGmail = google.gmail({
			version: 'v1',
			auth: this.oauth2Client,
		});
	};
	loadSavedCredentialsIfExist = () => {
		try {
			const content = fs.readFileSync(CREDENTIALS_PATH);
			const credentials = JSON.parse(content);

			console.log('loadSavedCredentialsIfExist:', credentials);
			return credentials;
		} catch (err) {
			return null;
		}
	};
	connectPubSub = async () => {
		try {
			this.setCredentialsOauth(this.loadSavedCredentialsIfExist());
			this.listenToken();
			this.resetGoogleGmail();
			const res = await this.watchGmail();
			console.log('connectPubSub', res);
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
	 *
	 * @return {Promise<void>}
	 */

	saveCredentials(credentials) {
		const loadCredential = this.loadSavedCredentialsIfExist();
		const data = {
			// refresh_token:
			// 	'1//0evoF6UJwoYYnCgYIARAAGA4SNwF-L9Irle2xCnGUYL4CjBFi_ALDgelIAdoVKHwS32eQdubiza5jk1FCsOBJBkNps0c7WTXOwJ4',
			...loadCredential,
			...credentials,
		};
		const payload = JSON.stringify(data);

		fs.writeFileSync(CREDENTIALS_PATH, payload);
	}
	start = () => {
		this.connectPubSub();
	};
}

// module.exports = new GoogleApiConfig();
