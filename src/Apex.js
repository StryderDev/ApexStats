const { Client, GatewayIntentBits, Collection, ActivityType, Partials } = require('discord.js');

const { Guilds } = GatewayIntentBits;
const {} = Partials;

const { discord } = require('./config.json');
const { getSeasonEmbed } = require('./slash/info/functions/getSeasonEmbed.js');

const fs = require('fs');
const path = require('path');

const client = new Client({ intents: [Guilds] });

const commandFolders = fs.readdirSync(path.join(__dirname, '/slash'));

const commands = [];

const { loadEvents } = require('./handlers/events.js');

client.commands = new Collection();

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(path.join(__dirname, `/slash/${folder}`)).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const command = require(path.join(__dirname, `/slash/${folder}/${file}`));

		commands.push(command.data.toJSON());
		client.commands.set(command.data.name, command);
	}
}

// client.once('ready', () => {
// 	async function uptimeCount() {
// 		(function loop() {
// 			const uptime = process.uptime();
// 			const seconds = Math.floor(uptime % 60);
// 			const minutes = Math.floor((uptime % (60 * 60)) / 60);
// 			const hours = Math.floor(uptime / (60 * 60));
// 			const days = Math.floor(uptime / 86400);

// 			console.log(`[>>> Shard #${client.shard.ids[0] + 1} Uptime: ${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds]`);

// 			now = new Date();
// 			var delay = 60000 - (now % 60000);
// 			setTimeout(loop, delay);
// 		})();
// 	}

// 	uptimeCount();
// });

// client.on('interactionCreate', async interaction => {
// 	if (interaction.type === InteractionType.ApplicationCommand) {
// 		await interaction.deferReply();

// 		const command = client.commands.get(interaction.commandName);

// 		if (!command) return;

// 		try {
// 			await command.execute(interaction);
// 			console.log(`[>>>> Command ran: /${interaction.commandName}]`);
// 		} catch (err) {
// 			if (err) console.error(err);

// 			await interaction.editReply({ content: 'An error has occured.', embeds: [] });
// 		}
// 	}
// 	if (interaction.isSelectMenu()) {
// 		if (interaction.customId == 'seasonInfo') {
// 			await interaction.deferUpdate();

// 			const seasonEmbed = await getSeasonEmbed(interaction.values[0]);

// 			interaction.editReply({
// 				embeds: [seasonEmbed],
// 				components: [],
// 			});
// 		}
// 	} else {
// 		return;
// 	}
// });

client.login(discord.token).then(() => {
    loadEvents(client);
}).catch((err) => console.log(err));
