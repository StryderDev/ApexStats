const client = require("../Apex");

client.on("messageCreate", async (message) => {
	if (
		message.author.bot ||
		!message.guild ||
		!message.content.toLowerCase().startsWith(client.config.prefix)
	)
		return;

	if (message.content.startsWith(client.config.prefix))
		return message.reply({
			content: "test",
			allowedMentions: { repliedUser: false },
		});

	// if (!command) return;
	// await command.run(client, message, args);
});
