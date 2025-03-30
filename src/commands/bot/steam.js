const axios = require('axios');
const chalk = require('chalk');
const { emoteFile } = require('../../utilities/misc.js');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const emotes = require(`../../data/${emoteFile(process.env.DEBUG)}Emotes.json`);

module.exports = {
	data: new SlashCommandBuilder().setName('steam').setDescription('View current Steam player count'),

	async execute(interaction) {
		const loadingEmbed = new EmbedBuilder().setDescription(`${emotes.loading} Loading Steam player data...`);
		await interaction.editReply({ embeds: [loadingEmbed] });

		await axios
			.get(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=1172470`)
			.then(async res => {
				const steam = res.data;

				const steamEmbed = new EmbedBuilder()
					.setTitle(`${emotes.pc} Current Steam Player Count`)
					.setDescription(
						`${
							emotes.listArrow
						} **${steam.response.player_count.toLocaleString()}** players currently online\n\n-# Player count only includes data from Steam.\n-# Does not include data from other platforms.`,
					);

				interaction.editReply({ embeds: [steamEmbed] });
			})
			.catch(err => {
				console.error(chalk.red(`${chalk.bold('[STEAM]')} Axios error: ${err}`));

				const errorEmbed = new EmbedBuilder().setDescription(`${emotes.listArrow} An error occurred while fetching Steam data. Please try again later.`);

				interaction.editReply({ embeds: [errorEmbed] });
			});
	},
};
