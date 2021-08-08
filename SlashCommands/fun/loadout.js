const { Client, CommandInteraction } = require('discord.js');

const guns = require('../../data/guns.json');

module.exports = {
	name: 'loadout',
	description: 'Picks a random loadout to use in game.',

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	run: async (client, interaction) => {
		const one = Math.floor(Math.random() * guns.length);
		const two = Math.floor(Math.random() * guns.length);

		interaction.followUp({ content: `Run the **${guns[one]}** and the **${guns[two]}** this round.` });
	},
};
