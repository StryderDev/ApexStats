// const db = require('sqlite3');
const axios = require('axios');
const chalk = require('chalk');
const db = require('../../utilities/database.js');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { embedColor, Misc } = require('../../data/utilities.json');
const { getStatus, rankLayout, platformName, platformEmote } = require('../../utilities/stats.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('link')
		.setDescription('Link an existing Apex account to your Discord account.')
		.addStringOption(option =>
			option.setName('platform').setDescription('The platform you play on').setRequired(true).addChoices(
				{
					name: 'PC (Steam/Origin)',
					value: 'PC',
				},
				{
					name: 'PlayStation',
					value: 'PS4',
				},
				{
					name: 'Xbox',
					value: 'X1',
				},
			),
		)
		.addStringOption(option => option.setName('username').setDescription("Your in-game username. If this doesn't work, try a previous username").setRequired(true)),

	async execute(interaction) {
		// Slash Command Options
		const platform = interaction.options.getString('platform');
		const username = interaction.options.getString('username');

		const loadingEmbed = new EmbedBuilder().setDescription(`${Misc.Loading} Loading data for selected account...`).setColor(embedColor);

		await interaction.editReply({ embeds: [loadingEmbed] });

		await axios
			.get(`https://api.jumpmaster.xyz/user/Stats?platform=${platform}&player=${encodeURIComponent(username)}&key=${process.env.SPYGLASS}`)
			.then(response => {
				const data = response.data;

				// User Data
				const playerID = data.user.id;
				const discordID = interaction.user.id;

				let linkQuery = 'SELECT * FROM specter WHERE discordID = ?';

				db.query(linkQuery, [discordID], (err, row) => {
					if (err) {
						console.log(err);
						return interaction.editReply({ content: 'There was a database error.', embeds: [] });
					}

					// console.log(row);

					if (row.length === 0) {
						let insertUserLink = `INSERT INTO specter (discordID, playerID, platform) VALUES(?, ?, ?)`;

						db.query(insertUserLink, [discordID, playerID, platform], (err, row) => {
							if (err) return console.log(err);
						});

						return interaction.editReply({
							content: `Linked player \`${data.user.username}\` to discord account \`${interaction.user.tag}\`. Use \`/me\` to view your linked account.`,
							embeds: [],
						});
					} else {
						return interaction.editReply({
							content: 'You already have a linked account. Use `/me` to see your linked account or `/unlink` to unlink your account.',
							embeds: [],
						});
					}
				});
			})
			.catch(error => {
				if (error.response) {
					console.log(chalk.yellow(`${chalk.bold('[PLAYER LOOKUP ERROR]')} ${error.response.data.errorShort}`));

					const errorEmbed = new EmbedBuilder()
						.setTitle('Player Lookup Error')
						.setDescription(`There was an error finding your account, linking to your discord account has been canceled.\n\n${error.response.data.error}`)
						.setColor('D0342C')
						.setTimestamp();

					// axios.get(`https://api.jumpmaster.xyz/logs/Stats?type=error&dev=${debug}`);

					interaction.editReply({ embeds: [errorEmbed] });
				} else if (error.request) {
					console.log(error.request);

					const errorEmbed = new EmbedBuilder()
						.setTitle('Site Lookup Error')
						.setDescription(
							`There was an error finding your account, linking to your discord account has been canceled.\n\nThe request was not returned successfully.\nThis is potentially an error with the API.\nPlease try again shortly.`,
						)
						.setColor('D0342C')
						.setTimestamp();

					interaction.editReply({ embeds: [errorEmbed] });
				} else {
					console.log(error.message);

					const errorEmbed = new EmbedBuilder()
						.setTitle('Unknown Error')
						.setDescription(`This should never happen.\nIf you see this error, please contact <@360564818123554836> ASAP.`)
						.setColor('D0342C');

					interaction.editReply({ embeds: [errorEmbed] });
				}
			});
	},
};
