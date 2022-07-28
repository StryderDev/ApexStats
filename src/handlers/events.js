const chalk = require('chalk');

function loadEvents(client) {
	const fs = require('fs');

	const folders = fs.readdirSync(__dirname + '/../events');

	for (const folder of folders) {
		const eventFiles = fs.readdirSync(__dirname + `/../events/${folder}`).filter(file => file.endsWith('.js'));

		for (const file of eventFiles) {
			const event = require(`../events/${folder}/${file}`);

			if (event.rest) {
				if (event.once) {
					client.rest.once(event.name, (...args) => event.execute(...args, client));
				} else {
					client.rest.on(event.name, (...args) => event.execute(...args, client));
				}
			} else {
				if (event.once) {
					client.once(event.name, (...args) => event.execute(...args, client));
				} else {
					client.on(event.name, (...args) => event.execute(...args, client));
				}
			}

			console.log(chalk`{yellow.bold [>> ${file} Event Loaded]}`);
		}
	}
}

module.exports = { loadEvents };
