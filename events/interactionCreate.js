module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction, client) {
		if (interaction.isCommand()) {
			await interaction.deferReply();

			const cmd = client.slashCommands.get(interaction.commandName);

			if (!cmd) return console.log('Error');

			cmd.run(client, interaction);
		}
	},
};
