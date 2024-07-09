const a = {
	config: {
		url: 'https://gmail.googleapis.com/gmail/v1/users/me/messages/189aaf9691e11c09',
		method: 'GET',
		// userAgentDirectives: [[Object]],
		// paramsSerializer: [Function(anonymous)],
		headers: {
			'x-goog-api-client': 'gdcl/6.0.4 gl-node/18.16.0',
			'Accept-Encoding': 'gzip',
			'User-Agent': 'google-api-nodejs-client/6.0.4 (gzip)',
			Authorization:
				'Bearer ya29.a0AbVbY6MaQG8hDow78lfXmQzj5EWbCXrPPb3w12awJusj1X1kR-OJr4NL2M_Ub40YNJhX0Ds6TryIwmkJbkXiLHwo9KBQl_2G1FLCVSrCsbTf-f-ZxJ_WAYkk3BDuL18aXLyiCq7w7cLpS30RM9He0zsBpvxNewaCgYKAacSARASFQFWKvPl1n5WSP_XkrCKq9fB76uuZg0165',
			Accept: 'application/json',
		},
		params: {},
		// validateStatus: [Function(anonymous)],
		retry: true,
		responseType: 'json',
	},
	data: {
		id: '189aaf9691e11c09',
		threadId: '189aaf9691e11c09', // 8740584777363402
		labelIds: ['UNREAD', 'IMPORTANT', 'CATEGORY_PERSONAL', 'INBOX'],
		snippet: 'tuan test',
		payload: {
			partId: '',
			mimeType: 'multipart/alternative',
			filename: '',
			// headers: [Array],
			// body: [Object],
			// parts: [Array],
		},
		sizeEstimate: 5105,
		historyId: '1571366',
		internalDate: '1690790607000',
	},
	headers: {
		'alt-svc': 'h3=":443"; ma=2592000,h3-29=":443"; ma=2592000',
		'cache-control': 'private',
		connection: 'close',
		'content-encoding': 'gzip',
		'content-type': 'application/json; charset=UTF-8',
		date: 'Mon, 31 Jul 2023 08:27:41 GMT',
		server: 'ESF',
		'transfer-encoding': 'chunked',
		vary: 'Origin, X-Origin, Referer',
		'x-content-type-options': 'nosniff',
		'x-frame-options': 'SAMEORIGIN',
		'x-xss-protection': '0',
	},
	status: 200,
	statusText: 'OK',
	request: {
		responseURL:
			'https://gmail.googleapis.com/gmail/v1/users/me/messages/189aaf9691e11c09',
	},
};

const b = {
	id: '189ac3532267d8fe',
	threadId: '189ac3532267d8fe',
	labelIds: ['UNREAD', 'IMPORTANT', 'CATEGORY_PERSONAL', 'INBOX'],
	snippet: 'tuan12345678910',
	payload: {
		partId: '',
		mimeType: 'multipart/alternative',
		filename: '',
		headers: [
			{
				name: 'Delivered-To',
				value: 'chomottinhyeu127@gmail.com',
			},
			{
				name: 'Received',
				value: 'by 2002:a05:6f02:b9b:b0:55:deb3:8fdb with SMTP id n27csp1904139rcg;        Mon, 31 Jul 2023 06:48:37 -0700 (PDT)',
			},
			{
				name: 'X-Received',
				value: 'by 2002:a25:5f4b:0:b0:d10:7acb:24e0 with SMTP id h11-20020a255f4b000000b00d107acb24e0mr8140738ybm.41.1690811314800;        Mon, 31 Jul 2023 06:48:34 -0700 (PDT)',
			},
			{
				name: 'ARC-Seal',
				value: 'i=1; a=rsa-sha256; t=1690811314; cv=none;        d=google.com; s=arc-20160816;        b=VSNeP3ybuqAlvwJOKWnPQQ1xElBv+f6XbflJDyhm9P0+/JAfwbLDvM50StEuadjQMr         0gEAgm8/QQhorw6IKTcQXFoqLQFLrwLXLSRarn0hRKsM2mQf+Aw1d57wa62r8dVdSE+3         JWHWyS4Sr/JyGpC9tL5ld2eJWzk+zSAE1UMNS5oG/QdjLoj9PPKvimeLCQ7+jfJaOYkd         n7CvxrrrbZtFY52osKe874vPDGxB+GQSRdeTLB7CXWq1U/HODFur7MGEboUH32vP0Qim         NM/HFxCd/vzA3YjElUV/sspu8890wurBJWuoAhh2hjR4VoGXhGu8vR8qAny8xYbeCjec         Kdew==',
			},
			{
				name: 'ARC-Message-Signature',
				value: 'i=1; a=rsa-sha256; c=relaxed/relaxed; d=google.com; s=arc-20160816;        h=to:subject:message-id:date:from:mime-version:dkim-signature;        bh=ox13YNnjd+opVZUCa/nB3g+yYSdguj774pwLpPJJnp8=;        fh=UjdXRUtCb6IUKHKNLb7baKMOjj+ODhUg+zmM2UfJeLw=;        b=UAOHrgh1pj/zX5518UyqBvSclKpayMq+AoZKFPaoon8BWv0S/eGQhxISlN0fSPYtUP         Sgm7zPGb5i5WN273jb8gwxiiUcNk+RCLqWltlwSS9mLb41A0chuR0Y221is5vVHma/hI         zlGWrJs4yHMen9TxBQrQji6+0aY1DhlYWT3EiNG1WWJKQMBJgITeJE8D7ZZLC/Tg4yyA         76KuluXV8t7XKtozi7b3cOTBdR2uN4dVlhf4Uywdf7aMqySk3P6RfPBEh5dAbrhT7veL         EN+4W+yfuq1YkSZNZ7Q8LGCU2CSa1XfaXO9XbuDweuBfSyBA5jTda75KhFJPYgkzlBKP         ZeLA==',
			},
			{
				name: 'ARC-Authentication-Results',
				value: 'i=1; mx.google.com;       dkim=pass header.i=@gmail.com header.s=20221208 header.b=EcEuBpQe;       spf=pass (google.com: domain of vandathd49@gmail.com designates 209.85.220.41 as permitted sender) smtp.mailfrom=vandathd49@gmail.com;       dmarc=pass (p=NONE sp=QUARANTINE dis=NONE) header.from=gmail.com',
			},
			{
				name: 'Return-Path',
				value: '<vandathd49@gmail.com>',
			},
			{
				name: 'Received',
				value: 'from mail-sor-f41.google.com (mail-sor-f41.google.com. [209.85.220.41])        by mx.google.com with SMTPS id b137-20020a25348f000000b00cab9746ef10sor2743724yba.17.2023.07.31.06.48.28        for <chomottinhyeu127@gmail.com>        (Google Transport Security);        Mon, 31 Jul 2023 06:48:34 -0700 (PDT)',
			},
			{
				name: 'Received-SPF',
				value: 'pass (google.com: domain of vandathd49@gmail.com designates 209.85.220.41 as permitted sender) client-ip=209.85.220.41;',
			},
			{
				name: 'Authentication-Results',
				value: 'mx.google.com;       dkim=pass header.i=@gmail.com header.s=20221208 header.b=EcEuBpQe;       spf=pass (google.com: domain of vandathd49@gmail.com designates 209.85.220.41 as permitted sender) smtp.mailfrom=vandathd49@gmail.com;       dmarc=pass (p=NONE sp=QUARANTINE dis=NONE) header.from=gmail.com',
			},
			{
				name: 'DKIM-Signature',
				value: 'v=1; a=rsa-sha256; c=relaxed/relaxed;        d=gmail.com; s=20221208; t=1690811308; x=1691416108;        h=to:subject:message-id:date:from:mime-version:from:to:cc:subject         :date:message-id:reply-to;        bh=ox13YNnjd+opVZUCa/nB3g+yYSdguj774pwLpPJJnp8=;        b=EcEuBpQefv13muH5nTa/CbrBT82qE4YycE5Uow+acP1B6Vc+Y6rQRrKZPyAVHZHOuI         VsXHBX3oHW0o1hOmm/yV09C1PMewO6tEQGUquUmRLzMjCUDpdBIFJNWHdtxsTzLsn3KG         Ydc3460c+KrgoKPZmN2R3iJzm3M5yNjpxscvcCGgvMU9Y59f3U+q/yw6NcWKmic0m9VA         CQ0FwY8+VpBV569wwudMSIK/1libUycO7yj6QUTJLyHHGKsAIB0XTZNeFOrQyX840GR3         a4xdiQtEzPvX67M3odn6s7ClmlAXBAlQ+HS45AVpqBbjTKVOweoXV2ECuLK92OqWZLvT         zXBQ==',
			},
			{
				name: 'X-Google-DKIM-Signature',
				value: 'v=1; a=rsa-sha256; c=relaxed/relaxed;        d=1e100.net; s=20221208; t=1690811308; x=1691416108;        h=to:subject:message-id:date:from:mime-version:x-gm-message-state         :from:to:cc:subject:date:message-id:reply-to;        bh=ox13YNnjd+opVZUCa/nB3g+yYSdguj774pwLpPJJnp8=;        b=I+sRxQpR0AqC2AWjUQ2Ph8wj4SW2jCKkubsiT5/Pb//dfnpg8Pf0D11+aLJP39U0PP         UzbdOpRm1hPdOjNBl/YAHeleNs6WDnK9IjI+qP2c2h6BwG6TZ5YWFjBO5dr6wEHfLNxr         S925jc48I3dmHZ257yo3PxHfDfEU0Eav1S63Ux+bIjkVfiLG7rsAOVWqMdU6CUBcVQ1u         N4gQ/VFqMEi5d7JhpfEBVLo+HamqjnhgeM1/+9eT7JjUyYFigZ01KIRns1SPVUn452HZ         qUDlFij4+MOtzsNjLXZaw5mnMcWgH42goGS28l0V0qx3pO/hmhNo4K9n2yBBpECyhWxm         00Vg==',
			},
			{
				name: 'X-Gm-Message-State',
				value: 'ABy/qLayLMzxUHsj/uqn+6fZUGkepkS+1DlSdoA4yVKyEjIDRESnigg4 WL7cTCxyaEgNsF0vgOTOCUeX+JjD4Q9r0o61+tGH8FRiKAg=',
			},
			{
				name: 'X-Google-Smtp-Source',
				value: 'APBJJlFDUEkLYWjEjzY3PuRqz5QJ9XplUmq3tUBMgw+rPVwd+jm+R0emZssLgRucUx0QIM+G06wBqYfCWS6E+F5yqaI=',
			},
			{
				name: 'X-Received',
				value: 'by 2002:a25:50cb:0:b0:d35:f59a:6e46 with SMTP id e194-20020a2550cb000000b00d35f59a6e46mr479091ybb.49.1690811308434; Mon, 31 Jul 2023 06:48:28 -0700 (PDT)',
			},
			{
				name: 'MIME-Version',
				value: '1.0',
			},
			{
				name: 'From',
				value: '"Phạm Văn Tuân" <vandathd49@gmail.com>',
			},
			{
				name: 'Date',
				value: 'Mon, 31 Jul 2023 20:48:17 +0700',
			},
			{
				name: 'Message-ID',
				value: '<CAMNN4PhL9zj1qgV1J6hvPLNEnOEmY8wV_o5Sih6U1419FNX8yA@mail.gmail.com>',
			},
			{
				name: 'Subject',
				value: '',
			},
			{
				name: 'To',
				value: 'chomottinhyeu127@gmail.com',
			},
			{
				name: 'Content-Type',
				value: 'multipart/alternative; boundary="0000000000006beadd0601c8afe1"',
			},
		],
		body: {
			size: 0,
		},
		parts: [
			{
				partId: '0',
				mimeType: 'text/plain',
				filename: '',
				headers: [
					{
						name: 'Content-Type',
						value: 'text/plain; charset="UTF-8"',
					},
				],
				body: {
					size: 17,
					data: 'dHVhbjEyMzQ1Njc4OTEwDQo=',
				},
			},
			{
				partId: '1',
				mimeType: 'text/html',
				filename: '',
				headers: [
					{
						name: 'Content-Type',
						value: 'text/html; charset="UTF-8"',
					},
				],
				body: {
					size: 38,
					data: 'PGRpdiBkaXI9Imx0ciI-dHVhbjEyMzQ1Njc4OTEwPC9kaXY-DQo=',
				},
			},
		],
	},
	sizeEstimate: 5121,
	historyId: '1571614',
	internalDate: '1690811297000',
};

const c = {
	history: [
		{
			id: '1571614',
			messages: [
				{
					id: '189ac3532267d8fe',
					threadId: '189ac3532267d8fe',
				},
			],
			messagesAdded: [
				{
					message: {
						id: '189ac3532267d8fe',
						threadId: '189ac3532267d8fe',
						labelIds: [
							'UNREAD',
							'IMPORTANT',
							'CATEGORY_PERSONAL',
							'INBOX',
						],
					},
				},
			],
		},
		{
			id: '1571698',
			messages: [
				{
					id: '189ac3532267d8fe',
					threadId: '189ac3532267d8fe',
				},
			],
		},
		{
			id: '1571699',
			messages: [
				{
					id: '189ac3532267d8fe',
					threadId: '189ac3532267d8fe',
				},
			],
			labelsRemoved: [
				{
					message: {
						id: '189ac3532267d8fe',
						threadId: '189ac3532267d8fe',
						labelIds: ['IMPORTANT', 'CATEGORY_PERSONAL', 'INBOX'],
					},
					labelIds: ['UNREAD'],
				},
			],
		},
		{
			id: '1571700',
			messages: [
				{
					id: '189ac3532267d8fe',
					threadId: '189ac3532267d8fe',
				},
			],
		},
		{
			id: '1571755',
			messages: [
				{
					id: '189ac3532267d8fe',
					threadId: '189ac3532267d8fe',
				},
			],
		},
	],
	historyId: '1571763',
};

const d = {
	history: [
		{
			id: '1571765',
			messages: [
				{
					id: '189ac6a44f5065af',
					threadId: '189ac6a44f5065af',
				},
			],
			messagesAdded: [
				{
					message: {
						id: '189ac6a44f5065af',
						threadId: '189ac6a44f5065af',
						labelIds: [
							'UNREAD',
							'IMPORTANT',
							'CATEGORY_PERSONAL',
							'INBOX',
						],
					},
				},
			],
		},
	],
	historyId: '1571838',
};

const c = {
	history: [
		{
			id: '1571842',
			messages: [
				{
					id: '18985490ff5b54be',
					threadId: '18985490ff5b54be',
				},
			],
		},
		{
			id: '1571843',
			messages: [
				{
					id: '189860333863de0f',
					threadId: '189860333863de0f',
				},
			],
		},
		{
			id: '1571844',
			messages: [
				{
					id: '18986050c7c6362c',
					threadId: '18986050c7c6362c',
				},
			],
		},
		{
			id: '1571845',
			messages: [
				{
					id: '189861ff13c65773',
					threadId: '189861ff13c65773',
				},
			],
		},
		{
			id: '1571852',
			messages: [
				{
					id: '189ac6a44f5065af',
					threadId: '189ac6a44f5065af',
				},
			],
		},
		{
			id: '1571862',
			messages: [
				{
					id: '189ac823d19cfde4',
					threadId: '189ac823d19cfde4',
				},
			],
			messagesAdded: [
				{
					message: {
						id: '189ac823d19cfde4',
						threadId: '189ac823d19cfde4',
						labelIds: [
							'UNREAD',
							'IMPORTANT',
							'CATEGORY_PERSONAL',
							'INBOX',
						],
					},
				},
			],
		},
		{
			id: '1571939',
			messages: [
				{
					id: '189ac823d19cfde4',
					threadId: '189ac823d19cfde4',
				},
			],
		},
	],
	historyId: '1571952',
};
{
  "history": [
    {
      "id": "1571765",
      "messages": [
        {
          "id": "189ac6a44f5065af",
          "threadId": "189ac6a44f5065af"
        }
      ],
      "messagesAdded": [
        {
          "message": {
            "id": "189ac6a44f5065af",
            "threadId": "189ac6a44f5065af",
            "labelIds": [
              "UNREAD",
              "IMPORTANT",
              "CATEGORY_PERSONAL",
              "INBOX"
            ]
          }
        }
      ]
    },
    {
      "id": "1571842",
      "messages": [
        {
          "id": "18985490ff5b54be",
          "threadId": "18985490ff5b54be"
        }
      ]
    },
    {
      "id": "1571843",
      "messages": [
        {
          "id": "189860333863de0f",
          "threadId": "189860333863de0f"
        }
      ]
    },
    {
      "id": "1571844",
      "messages": [
        {
          "id": "18986050c7c6362c",
          "threadId": "18986050c7c6362c"
        }
      ]
    },
    {
      "id": "1571845",
      "messages": [
        {
          "id": "189861ff13c65773",
          "threadId": "189861ff13c65773"
        }
      ]
    },
    {
      "id": "1571852",
      "messages": [
        {
          "id": "189ac6a44f5065af",
          "threadId": "189ac6a44f5065af"
        }
      ]
    },
    {
      "id": "1571862",
      "messages": [
        {
          "id": "189ac823d19cfde4",
          "threadId": "189ac823d19cfde4"
        }
      ],
      "messagesAdded": [
        {
          "message": {
            "id": "189ac823d19cfde4",
            "threadId": "189ac823d19cfde4",
            "labelIds": [
              "UNREAD",
              "IMPORTANT",
              "CATEGORY_PERSONAL",
              "INBOX"
            ]
          }
        }
      ]
    },
    {
      "id": "1571939",
      "messages": [
        {
          "id": "189ac823d19cfde4",
          "threadId": "189ac823d19cfde4"
        }
      ]
    }
  ],
  "historyId": "1571952"
}