const client = require('../Apex.js');
const chalk = require('chalk');
const { DateTime } = require('luxon');
const axios = require('axios');
const config = require('../config.json');

client.once('ready', () => {
	function setPresence() {
		let MapURL = 'https://fn.alphaleagues.com/v2/apex/map/';

		const MapRequest = axios.get(MapURL);

		const getServerCount = async () => {
			// get guild collection size from all the shards
			const req = await client.shard.fetchClientValues('guilds.cache.size');

			// return the added value
			return req.reduce((p, n) => p + n, 0);
		};

		getServerCount().then(count => {
			axios.all([MapRequest]).then(
				axios.spread((...responses) => {
					var BR = responses[0].data.br;
					var Arenas = responses[0].data.arenas;

					client.user.setPresence({
						activities: [
							{
								name: `on ${BR.map}/${Arenas.map} · Serving ${count.toLocaleString()} guilds`,
								type: 'PLAYING',
							},
						],
						status: 'online',
					});

					console.log(
						chalk`{blueBright [${DateTime.local().toFormat('hh:mm:ss')}] Updated presence, Battle Royale: ${
							BR.map
						}. Areans map: ${Arenas.map}}.`,
					);
				}),
			);
		});
	}

	setPresence();

	setInterval(function () {
		var date = new Date();

		if (date.getMinutes() % 10 == 0) {
			setPresence();
		}
	}, Math.max(1, 1 || 1) * 60 * 1000);
});
