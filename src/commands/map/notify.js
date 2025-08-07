const axios = require('axios');
const chalk = require('chalk');
const db = require('../../utilities/db.js');
const { emoteFile } = require('../../utilities/misc.js');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const emotes = require(`../../data/${emoteFile(process.env.DEBUG)}Emotes.json`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('notify')
		.setDescription('Set a notification to be reminded when the next map is in rotation')
		.addStringOption(option =>
			option
				.setName('type')
				.setDescription('Which rotation to be notified about')
				.setRequired(true)
				.addChoices({ name: 'BR', value: 'br' }, { name: 'Ranked', value: 'ranked' }, { name: 'Mixtape', value: 'mixtape' }, { name: 'Arenas', value: 'arenas' }, { name: 'LTM', value: 'ltm' }),
		),

	async execute(interaction) {
		const mapType = interaction.options.getString('type');

		const loadingEmbed = new EmbedBuilder().setDescription(`${emotes.loading} Loading map data...`);
		await interaction.editReply({ embeds: [loadingEmbed] });

		await axios
			.get(`https://solaris.apexstats.dev/beacon/map/${mapType}?next=1&key=${process.env.SPYGLASS}`)
			.then(res => {
				const mapData = res.data;
				const nextMapData = res.data.next;

				// TODO: Check if there are any active rotations for the selected mode, do not create reminder if there is none

				const mapQuery = 'INSERT INTO ApexStats_MapReminders (map_index, map_type, user_id, channel_id, server_id, timestamp) VALUES (?, ?, ?, ?, ?, ?)';

				db.query(mapQuery, [mapData.rotationIndex, mapType, interaction.user.id, interaction.channel.id, interaction.guild.id, Math.floor(Date.now())], (err, result) => {
					if (err) return console.log(chalk.red(`${chalk.bold('[NOTIFY]')} Query error: ${err.code}`));

					const notifyEmbed = new EmbedBuilder()
						.setTitle(`${emotes.check} Map Reminder Set`)
						.setDescription(`${emotes.listArrow} You will be notified <t:${mapData.times.nextMap}:R> when **${nextMapData[0].map.name}** is in rotation.`);

					interaction.editReply({ embeds: [notifyEmbed] });
				});
			})
			.catch(err => {
				console.error(chalk.red(`${chalk.bold('[NOTIFY]')} Axios error: ${err}`));

				const errorEmbed = new EmbedBuilder().setDescription(`${emotes.listArrow} An error occurred while fetching map data. Please try again later.`);

				interaction.editReply({ embeds: [errorEmbed] });
			});
	},
};
