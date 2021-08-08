const { Client, CommandInteraction } = require('discord.js');

const guns = require('../../data/guns.json');

module.exports = {
	name: 'loadout',
	/**
	 *
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	run: async (client, message, args) => {
		const one = Math.floor(Math.random() * guns.length);
		const two = Math.floor(Math.random() * guns.length);

		message.reply({ content: `Run the **${guns[one]}** and the **${guns[two]}** this round.` });
	},
};
