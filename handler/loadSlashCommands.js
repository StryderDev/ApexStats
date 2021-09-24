function loadSlashCommands(client) {
	const fs = require('fs');
	const ascii = require('ascii-table');

	let slash = [];

	const table = new ascii().setHeading('Slash Commands', 'Load Status');

	const commandFolders = fs.readdirSync('./slash');

	for (const folder of commandFolders) {
		const commandFiles = fs.readdirSync(`./slash/${folder}`).filter(file => file.endsWith('.js'));

		for (const file of commandFiles) {
			const command = require(`../slash/${folder}/${file}`);

			if (command.name) {
				client.slash.set(command.name, command);
				slash.push(command);
				table.addRow(file, ':D');
			} else {
				table.addRow(file, 'D:');
				continue;
			}
		}
		console.log(table.toString());
	}
	client.on('ready', async () => {
		const id = '873773620827131966';
		const guild = client.guilds.cache.get(id);

		if (guild) {
			commands = guild.commands.set(slash);
		} else {
			commands = client.application?.commands.set(slash);
		}
	});
}

module.exports = { loadSlashCommands };
