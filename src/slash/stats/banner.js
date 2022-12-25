const { EmbedBuilder, SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const axios = require('axios');
const { createCanvas } = require('canvas');

const { debug } = require('../../config.json');

const { platformName, getStatus, battlepass, rankLayout, getPlatformEmote } = require('./functions/stats.js');

const { Misc, Status, Account, Ranked } = require('../../data/emotes.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('banner')
		.setDescription('A recreation of your in-game banner, complete with badges and trackers.')
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
			.then(async response => {
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

				// Stats Image
				const width = 720;
				const height = 1080;

				const canvas = createCanvas(width, height);
				const context = canvas.getContext('2d');

				const text = 'Hello world!';
				context.font = 'bold 70pt Menlo';
				context.textAlign = 'center';
				context.fillStyle = '#fff';
				context.fillText(text, 600, 170);

				context.drawImage(0, 0, canvas.width, canvas.height);

				axios.get(`https://api.jumpmaster.xyz/logs/Stats?type=success&dev=${debug.true}`);

				const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'stats.png' });

				interaction.editReply({ content: 'Stats Image', embeds: [], files: [attachment] });
			})
			.catch(error => {
				if (error.response) {
					console.log(error.response.data);

					const errorEmbed = new EmbedBuilder().setDescription(`**Lookup Error**\n\`\`\`${error.response.data.error}\`\`\``).setColor('D0342C');

					axios.get(`https://api.jumpmaster.xyz/logs/Stats?type=error&dev=${debug.true}`);

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
