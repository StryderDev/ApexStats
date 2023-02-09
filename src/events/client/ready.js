const fs = require('fs');
const { Collection, REST, Routes } = require('discord.js');

const { debug, discord } = require('../../config.json');

function uptime() {
	(function loop() {
		const uptime = process.uptime();
		const seconds = `${Math.floor(uptime % 60)} Seconds`;
		const minutes = `${Math.floor((uptime % (60 * 60)) / 60)} Minutes`;
		const hours = `${Math.floor((uptime / (60 * 60)) % 24)} Hours`;
		const days = `${Math.floor(uptime / 86400)} Days`;

		console.log(`Bot Uptime: ${days}, ${hours}, ${minutes}, ${seconds}`);

		now = new Date();
		var delay = 60000 - (now % 60000);
		setTimeout(loop, delay);
	})();
}

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		// Set bot presence
		client.user.setPresence({
			activities: [{ name: `Apex Legends` }],
		});

		// Display bot uptime in consolel
		uptime();

		// Register slash commands
		const commands = [];
		const clientID = client.user.id;
		const rest = new REST({ version: 10 }).setToken(discord.token);
		const folders = fs.readdirSync(`${__dirname}/../../commands`);

		client.commands = new Collection();

		for (const folder of folders) {
			const files = fs.readdirSync(`${__dirname}/../../commands/${folder}`).filter(file => file.endsWith('.js'));

			for (const file of files) {
				const command = require(`../../commands/${folder}/${file}`);

				commands.push(command.data.toJSON());
				client.commands.set(command.data.name, command);
			}
		}

		(async () => {
			try {
				if (debug == false) {
					await rest.put(Routes.applicationCommands(clientID), { body: commands });

					console.log(`[>> Successfully registered global slash commands <<]`);
				} else {
					await rest.put(Routes.applicationGuildCommands(clientID, discord.devGuild), { body: commands });

					console.log(`[>> Successfully registered local slash commands <<]`);
				}
			} catch (error) {
				if (error) console.log(error);
			}
		})();
	},
};
