const { CommandInteraction, MessageEmbed } = require('discord.js');
const axios = require('axios');
const guns = require('../../gameData/guns.json');

module.exports = {
	name: 'loadout',
	description: 'Choose a set of guns to use.',

	run: async (client, interaction) => {
		const gunOne = Math.floor(Math.random() * guns.length);
		const gunTwo = Math.floor(Math.random() * guns.length);

		interaction.editReply({ content: `Run the **${guns[gunOne]}** and the **${guns[gunTwo]}** this round.` });
	},
};
