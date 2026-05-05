const chalk = require('chalk');
const { InteractionType } = require('discord.js');

module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction, client) {
		if (!interaction.isCommand()) return;

		if (interaction.type === InteractionType.ApplicationCommand) {
			await interaction.deferReply();

			const command = client.commands.get(interaction.commandName);

			try {
				await command.execute(interaction);

				console.log(`${chalk.cyan.bold('[APEXSTATS_INTERACTION]')} ${interaction.user.username} used /${interaction.commandName}`);
			} catch (err) {
				console.error(`${chalk.red.bold('[APEXSTATS_INTERACTION]')} Interaction Error: ${err}`);
			}
		}
	},
};
