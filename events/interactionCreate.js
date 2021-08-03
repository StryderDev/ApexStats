const client = require('../Apex.js');

client.on('interactionCreate', async interaction => {
	if (interaction.isCommand()) {
		await interaction.defer().catch(() => {});

		const cmd = client.slashCommands.get(interaction.commandName);
		if (!cmd)
			return interaction.followUp({
				content: 'An error has occured.',
			});

		cmd.run(client, interaction);
	}
});
