const fs = require('fs');
const path = require('path');
const process = require('process');
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
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

let googleGmail = null;
let accessToken = null;

/*
 * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI
 * from the client_secret.json file. To get these credentials for your application, visit
 * https://console.cloud.google.com/apis/credentials.
 */
let keys = { redirect_uris: [''] };
if (fs.existsSync(GMAIL_CONFIG_PATH)) {
	keys = require(GMAIL_CONFIG_PATH).web;
}
/**
 * Create a new OAuth2 client with the configured keys.
 */
const oauth2Client = new google.auth.OAuth2(
	keys.client_id,
	keys.client_secret,
	keys.redirect_uris[0]
);

function loadSavedCredentialsIfExist() {
	try {
		const content = fs.readFileSync(CREDENTIALS_PATH);
		const credentials = JSON.parse(content);

		console.log('loadSavedCredentialsIfExist:', credentials);
		return credentials;
	} catch (err) {
		return null;
	}
}
/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @return {Promise<void>}
 */

function saveCredentials(credentials) {
	const loadCredential = loadSavedCredentialsIfExist();
	const data = {
		// refresh_token:
		// 	'1//0evoF6UJwoYYnCgYIARAAGA4SNwF-L9Irle2xCnGUYL4CjBFi_ALDgelIAdoVKHwS32eQdubiza5jk1FCsOBJBkNps0c7WTXOwJ4',
		...loadCredential,
		...credentials,
	};
	const payload = JSON.stringify(data);

	fs.writeFileSync(CREDENTIALS_PATH, payload);
}
// oauth2Client.setCredentials();
/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @return {Promise<String>}
 */

async function getAuthorizationUrl() {
	return oauth2Client.generateAuthUrl({
		// 'online' (default) or 'offline' (gets refresh_token)
		access_type: 'offline',
		scope: SCOPES,
	});
}

/**
 *
 * @return {gmail_v1.Gmail}
 */

function getGoogleGmail() {
	return googleGmail;
}

// Connect to Pub Sub
async function connectPubSub() {
	try {
		oauth2Client.setCredentials(loadSavedCredentialsIfExist());
		oauth2Client.on('tokens', (tokens) => {
			saveCredentials(tokens);
			if (tokens.refresh_token) {
				// store the refresh_token in my database!
				console.log(tokens.refresh_token);
			}
		});
		googleGmail = google.gmail({
			version: 'v1',
			auth: oauth2Client,
		});
		// googleGmail.users.history.list()
		const res = await googleGmail.users.watch({
			userId: 'me',
			requestBody: {
				labelIds: ['INBOX'],
				topicName: TOPIC_NAME,
			},
		});
		console.log('connectPubSub', res);
	} catch (error) {
		console.log(error);
	}
}

async function getAcessToken(code) {
	try {
		const data = await oauth2Client.getToken(code);
		const { tokens } = data;
		saveCredentials(tokens);
		oauth2Client.setCredentials(tokens);
		console.log('success set up googleGmail');
	} catch (error) {
		console.log(error);
	}
}
// '1//0evoF6UJwoYYnCgYIARAAGA4SNwF-L9Irle2xCnGUYL4CjBFi_ALDgelIAdoVKHwS32eQdubiza5jk1FCsOBJBkNps0c7WTXOwJ4'
async function setGoogleGmail(code) {
	await getAcessToken(code);
	connectPubSub();
	Logger.writeLog('info', {
		message: 'success set up googleGmail',
	});
}

class GoogleApiConfig {
	constructor() {
		const { client_id, client_secret, redirect_uris } = this.keys;
		this.oauth2Client = new google.auth.OAuth2(
			client_id,
			client_secret,
			redirect_uris[0]
		);
	}
	keys = require(GMAIL_CONFIG_PATH).web;

	googleGmail = null;
	CREDENTIALS_PATH = path.join(
		process.cwd(),
		'config/credentials.config.json'
	);
	GMAIL_CONFIG_PATH = path.join(process.cwd(), 'config/google.config.json');
	TOPIC_NAME = 'projects/project-01-gmail-webhook/topics/GmailIncomingEmail';
	SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
	async setGoogleGmail(code) {
		await getAcessToken(code);
		this.connectPubSub();
		Logger.writeLog('info', {
			message: 'success set up googleGmail',
		});
	}
	getGoogleGmail() {
		return this.googleGmail;
	}
	async connectPubSub() {
		try {
			oauth2Client.setCredentials(loadSavedCredentialsIfExist());
			oauth2Client.on('tokens', (tokens) => {
				saveCredentials(tokens);
				if (tokens.refresh_token) {
					// store the refresh_token in my database!
					console.log(tokens.refresh_token);
				}
			});
			googleGmail = google.gmail({
				version: 'v1',
				auth: oauth2Client,
			});
			// googleGmail.users.history.list()
			const res = await googleGmail.users.watch({
				userId: 'me',
				requestBody: {
					labelIds: ['INBOX'],
					topicName: TOPIC_NAME,
				},
			});
			console.log('connectPubSub', res);
		} catch (error) {
			console.log(error);
		}
	}

	/**
	 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
	 *
	 * @return {Promise<void>}
	 */

	saveCredentials(credentials) {
		const loadCredential = loadSavedCredentialsIfExist();
		const data = {
			// refresh_token:
			// 	'1//0evoF6UJwoYYnCgYIARAAGA4SNwF-L9Irle2xCnGUYL4CjBFi_ALDgelIAdoVKHwS32eQdubiza5jk1FCsOBJBkNps0c7WTXOwJ4',
			...loadCredential,
			...credentials,
		};
		const payload = JSON.stringify(data);

		fs.writeFileSync(CREDENTIALS_PATH, payload);
	}
	start() {
		this.connectPubSub();
	}
}

module.exports = { getAuthorizationUrl, getGoogleGmail, setGoogleGmail };
