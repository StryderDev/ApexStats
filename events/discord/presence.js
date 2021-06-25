const { client } = require("../../Apex.js");
const config = require("../../config.json");
const axios = require("axios");
const chalk = require("chalk");
const { DateTime } = require("luxon");

client.once("ready", () => {
	function setPresence() {
		let BR = axios.get(`https://fn.alphaleagues.com/v1/apex/map/`);
		let Arenas = axios.get(`https://api.mozambiquehe.re/maprotation?version=2&auth=${config.api.Mozambique}`);

		const serverCount = async () => {
			const request = await client.shard.fetchClientValues("guilds.cache.size");

			return request.reduce((p, n) => p + n, 0);
		};

		function arenaName(name) {
			if (name.startsWith("Phase")) return "Phase Runner";
			if (name.startsWith("Party")) return "Party Crasher";
			if (name.startsWith("Thermal")) return "Thermal Station";
			if (name.startsWith("Golden")) return "Golden Gardens";

			return name;
		}

		serverCount().then((count) => {
			axios.all([BR, Arenas]).then(
				axios.spread((...response) => {
					var BR = response[0].data;
					var Arenas = response[1].data.arenas;

					client.user.setPresence({
						activity: { name: `on ${BR.map}/${Arenas.current.map} · ${count.toLocaleString()} Guilds` },
					});

					console.log(
						chalk`{blueBright [${DateTime.local().toFormat("hh:mm:ss")}] Updated bot presence, BR: ${
							BR.map
						}, Arenas: ${arenaName(Arenas.current.map)}}`
					);
				})
			);
		});
	}

	setPresence();

	setInterval(function () {
		var date = new Date();

		if (date.getMinutes() % 5 == 0) {
			setPresence();
		}
	}, Math.max(1, 1 || 1) * 60 * 1000);
});
