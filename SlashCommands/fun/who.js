const { CommandInteraction, MessageEmbed } = require('discord.js');
const axios = require('axios');
const legends = require('../../gameData/legends.json');

module.exports = {
	name: 'who',
	description: 'Choose a random legend to play.',

	run: async (client, interaction) => {
		const legendIDs = [
			'898565421',
			'182221730',
			'1409694078',
			'1464849662',
			'827049897',
			'725342087',
			'1111853120',
			'2045656322',
			'843405508',
			'187386164',
			'80232848',
			'64207844',
			'1579967516',
			'2105222312',
			'88599337',
			'405279270',
			'435256162',
			'1794483389',
		];

		const randomLegend = Math.floor(Math.random() * legendIDs.length);

		var legendName = legends[legendIDs[randomLegend]].Name;
		var legendEmoteID = legends[legendIDs[randomLegend]].EmoteID;
		var legendEmote = `<:${legendName}:${legendEmoteID}>`;

		interaction.editReply({ content: `Play as ${legendName} this round!` });
	},
};
