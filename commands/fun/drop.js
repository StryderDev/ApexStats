const { Message, Client } = require('discord.js');
const axios = require('axios');

module.exports = {
	name: 'drop',
	/**
	 *
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	run: async (client, message, args) => {
		const mapName = args[0];

		if (mapName == null || mapName == undefined) {
			axios.get(`https://fn.alphaleagues.com/v2/apex/map/`).then(result => {
				var map = result.data.br.map;

				function mapTitle(name) {
					if (name == "World's Edge") return 'we';
					if (name == 'Kings Canyon') return 'kc';
					if (name == 'Olympus') return 'olympus';
				}

				mapFile = require(`../../data/drops/season10/${mapTitle(map)}.json`);

				var drop = `Drop in **${mapFile[Math.floor(Math.random() * mapFile.length)]}** on ${map}.`;

				message.reply({ content: drop });
			});
		} else {
			if (mapName != 'kc' && mapName != 'we' && mapName != 'olympus') return;

			function mapTitle(name) {
				if (name == 'we') return 'Worlds Edge';
				if (name == 'kc') return 'Kings Canyon';
				if (name == 'olympus') return 'Olympus';
			}

			mapFile = require(`../../data/drops/season10/${mapName}.json`);

			var drop = `Drop in **${mapFile[Math.floor(Math.random() * mapFile.length)]}** on ${mapTitle(mapName)}.`;

			message.reply({ content: drop });
		}
	},
};
