const client = require('../Apex.js');
const { WebhookClient } = require('discord.js');
const { DateTime } = require('luxon');
const chalk = require('chalk');

client.on('interactionCreate', async interaction => {
	const webhookClient = new WebhookClient({
		url: client.config.logs.interaction,
	});
	const timeLogs = DateTime.local().toFormat('hh:mm:ss');

	// Slash Command Handling
	if (interaction.isCommand()) {
		await interaction.deferReply({ ephemeral: false }).catch(() => {});

		const cmd = client.slashCommands.get(interaction.commandName);
		if (!cmd) return interaction.followUp({ content: 'An error has occured ' });

		const display = interaction.member.displayName;
		const name = display === undefined ? 'User' : display;

		webhookClient.send({
			content: `**User:** ${name}\n**Command:** /${interaction.commandName}`,
		});

		console.log(chalk`{blue.bold [${timeLogs}] User ${name} ran command /${interaction.commandName}}`);

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
