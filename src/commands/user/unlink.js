// const db = require('sqlite3');
const axios = require('axios');
const db = require('../../utilities/database.js');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { debug, api } = require('../../config.json');
const { embedColor, Misc } = require('../../data/utilities.json');
const { getStatus, rankLayout, battlepass, platformName, platformEmote } = require('../../utilities/stats.js');

module.exports = {
	data: new SlashCommandBuilder().setName('unlink').setDescription('Unlink your Apex account from your Discord account.'),

	async execute(interaction) {
		const loadingEmbed = new EmbedBuilder().setDescription(`${Misc.Loading} Loading data for selected account...`).setColor(embedColor);

		await interaction.editReply({ embeds: [loadingEmbed] });

		let linkQuery = 'SELECT * FROM specter WHERE discordID = ?';

		const discordID = interaction.user.id;

		db.query(linkQuery, [discordID], (err, row) => {
			if (err) {
				console.log(err);
				return interaction.editReply({ content: 'There was a database error.', embeds: [] });
			}

			if (row.length === 0) {
				return interaction.editReply({ content: `You do not have a linked account. Use \`/link\` to link an Apex account to your Discord account.`, embeds: [] });
			} else {
				// User already has an account linked
				let deleteUserLink = `DELETE FROM specter WHERE discordID = ?`;

				db.query(deleteUserLink, [discordID]);

				return interaction.editReply({ content: `You have successfully unlinked your account.`, embeds: [] });
			}
		});
	},
};
