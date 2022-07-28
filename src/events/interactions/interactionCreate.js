const chalk = require('chalk');
const { InteractionType } = require('discord.js');
const { getSeasonEmbed } = require('../../slash/info/functions/getSeasonEmbed.js');

module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction, client) {
		// Normal Slash Command
		if (interaction.type === InteractionType.ApplicationCommand) {
			await interaction.deferReply();

			const command = client.commands.get(interaction.commandName);

			if (!command) return;

			try {
				await command.execute(interaction);
				console.log(chalk`{magenta.bold [>>>> Command Ran: /${interaction.commandName}]}`);
			} catch (err) {
				if (err) console.error(err);

				await interaction.editReply({ content: 'An error has occured.', embeds: [] });
			}
		}

		// Select Menu Interaction
		if (interaction.isSelectMenu()) {
			if (interaction.customId == 'seasonInfo') {
				await interaction.deferUpdate();

				const seasonEmbed = await getSeasonEmbed(interaction.values[0]);

				interaction.editReply({
					embeds: [seasonEmbed],
					components: [],
				});
			}
		}
	},
};
