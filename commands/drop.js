const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const wait = require('util').promisify(setTimeout);

const { api } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder().setName('drop').setDescription('Picks a random place to drop in the current map.'),
	async execute(interaction) {
		await interaction.editReply({ content: '<a:ApexBot_Loading:940037271980220416> Choosing a random place to drop...' });
		await wait(1000);

		await axios
			.get(`https://api.mozambiquehe.re/maprotation?version=5&auth=${api.apex}`)
			.then(response => {
				const br = response.data.battle_royale;

				function mapFilePath(map) {
					return `../data/drops/Season 12/${map}.json`;
				}

				const mapFile = require(mapFilePath(br.current.map));
				const map = Math.floor(Math.random() * mapFile.length);

				const dropText = `Drop into **${mapFile[map]}** on ${br.current.map}.`;

				interaction.editReply({ content: dropText });
			})
			.catch(error => {
				// Request failed with a response outside of the 2xx range
				if (error.response) {
					console.log(error.response.data);
					// console.log(error.response.status);
					// console.log(error.response.headers);

					interaction.editReply({ content: `**Error**\n\`${error.response.data.error}\``, embeds: [] });
				} else if (error.request) {
					console.log(error.request);
					interaction.editReply({
						content: `**Error**\n\`The request was not returned successfully.\``,
						embeds: [],
					});
				} else {
					console.log(error.message);
					interaction.editReply({
						content: `**Error**\n\`Unknown. Try again or tell SDCore#0001.\``,
						embeds: [],
					});
				}
			});
	},
};
