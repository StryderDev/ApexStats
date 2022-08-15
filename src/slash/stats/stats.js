const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

const { platformName, getStatus, battlepass, rankLayout, trackerName, trackerValue } = require('./functions/stats.js');

const { Misc, Status, Account, Ranked, Season } = require('../../data/emotes.json');
const legends = require('../../data/legends.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Shows legend stats, account and rank info, and online status.')
		.addStringOption(option =>
			option
				.setName('platform')
				.setDescription('The platform you play Apex on.')
				.setRequired(true)
				.addChoices({ name: 'PC (Steam / Origin)', value: 'PC' }, { name: 'Xbox', value: 'X1' }, { name: 'PlayStation', value: 'PS4' }),
		)
		.addStringOption(option => option.setName('username').setDescription('Your in-game username.').setRequired(true)),
	async execute(interaction) {
		// Options
		const platform = interaction.options.getString('platform');
		const username = interaction.options.getString('username');

		const loading = new EmbedBuilder().setDescription(`${Misc.Loading} Loading data for ${username} on ${platformName(platform)}...`).setColor('2F3136');

		await interaction.editReply({ embeds: [loading] });

		await axios
			.get(`https://api.jumpmaster.xyz/user/Stats?platform=${platform}&player=${encodeURIComponent(username)}`)
			.then(response => {
				const data = response.data;

				// User data
				const user = data.user;
				const status = user.status;
				const legend = data.active.legend;

				// Ranked Data
				const ranked = data.ranked;
				const br = ranked.BR;
				const arenas = ranked.Arenas;

				// Tracker Data
				const trackers = data.active.trackers;

				// Stats Embed
				const stats = new EmbedBuilder()
					.setTitle(`Stats for ${user.username} on ${user.platform} playing ${legend}`)
					.setDescription(`**Status**\n${getStatus(status, Status)}`)
					.addFields([
						{
							name: `${Account.Level} Account`,
							value: `${Misc.GrayBlank} Level ${data.account.level.current.toLocaleString()}\n${Misc.GrayBlank}  Prestige ${
								data.account.level.prestige
							}\n\n**Battle Royale Ranked**\n${rankLayout('RP', br, Ranked)}`,
							inline: true,
						},
						{
							name: `${Account.BattlePass} Hunted Battle Pass`,
							value: `${Misc.GrayBlank} Level ${battlepass(data.account.battlepass)}\n\n\n**Arenas Ranked**\n${rankLayout('AP', arenas, Ranked)}`,
							inline: true,
						},
						{
							name: `\u200b`,
							value: '**Currently Equipped Trackers**',
							inline: false,
						},
						{
							name: trackers[0].id.toLocaleString(),
							value: trackers[0].value.toLocaleString(),
							inline: true,
						},
						{
							name: trackers[1].id.toLocaleString(),
							value: trackers[1].value.toLocaleString(),
							inline: true,
						},
						{
							name: trackers[2].id.toLocaleString(),
							value: trackers[2].value.toLocaleString(),
							inline: true,
						},
					])
					.setImage(`https://cdn.jumpmaster.xyz/Bot/Legends/Banners/${encodeURIComponent(legend)}.png`)
					.setColor('2F3136')
					.setFooter({ text: `Player Added: ${new Date(user.userAdded * 1000).toUTCString()}\nEquip the BattlePass badge to update it!` });

				interaction.editReply({ embeds: [stats] });
			})
			.catch(error => {
				if (error.response) {
					console.log(error.response.data);

					const errorEmbed = new EmbedBuilder().setDescription(`**Lookup Error**\n\`\`\`${error.response.data.error}\`\`\``).setColor('D0342C');

					interaction.editReply({ embeds: [errorEmbed] });
				} else if (error.request) {
					console.log(error.request);

					const errorEmbed = new EmbedBuilder().setDescription(`**Lookup Error**\n\`\`\`The request was not returned successfully. Try again\`\`\``).setColor('D0342C');

					interaction.editReply({ embeds: [errorEmbed] });
				} else {
					console.log(error.message);

					const errorEmbed = new EmbedBuilder()
						.setDescription(`**Unknown Error**\n\`\`\`Unknown or uncaught error. Try again or contact SDCore#0001.\`\`\``)
						.setColor('D0342C');

					interaction.editReply({ embeds: [errorEmbed] });
				}
			});
	},
};
