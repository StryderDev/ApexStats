const { InteractionType } = require('discord.js');

module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction, client) {
		if (interaction.type === InteractionType.ApplicationCommand) {
			await interaction.deferReply();

			const command = client.commands.get(interaction.commandName);

			if (!command) return;

			try {
				await command.execute(interaction);
				console.log(`[>>> ${interaction.user.tag} used /${interaction.commandName} <<<]`);
			} catch (error) {
				console.log(error);
			}
		}
	},
};
