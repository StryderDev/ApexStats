const client = require('../Apex');

client.on('interactionCreate', async interaction => {
	// Slash Command Handling
	if (interaction.isCommand()) {
		await interaction.deferReply({ ephemeral: false }).catch(err => {
			`Interaction Error: ${err}`;
		});

		const cmd = client.slashCommands.get(interaction.commandName);
		if (!cmd) return interaction.followUp({ content: 'An error has occured ' });

		cmd.run(client, interaction);
	}
});
