const client = require('../index.js');
const { WebhookClient } = require('discord.js');

client.on('interactionCreate', async interaction => {
	const webhookClient = new WebhookClient({
		url: client.config.logs.interaction,
	});

	// Slash Command Handling
	if (interaction.isCommand()) {
		await interaction.deferReply({ ephemeral: false }).catch(() => {});

		const cmd = client.slashCommands.get(interaction.commandName);
		if (!cmd) return interaction.followUp({ content: 'An error has occured ' });

		webhookClient.send({
			content: `**User:** ${interaction.member.displayName}\n**Command:** /${interaction.commandName}`,
		});

		const args = [];

		for (let option of interaction.options.data) {
			if (option.type === 'SUB_COMMAND') {
				if (option.name) args.push(option.name);
				option.options?.forEach(x => {
					if (x.value) args.push(x.value);
				});
			} else if (option.value) args.push(option.value);
		}
		interaction.member = interaction.guild.members.cache.get(interaction.user.id);

		cmd.run(client, interaction, args);
	}

	// Context Menu Handling
	if (interaction.isContextMenu()) {
		await interaction.deferReply({ ephemeral: false });
		const command = client.slashCommands.get(interaction.commandName);
		if (command) command.run(client, interaction);
	}
});
