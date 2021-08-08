const { Client, CommandInteraction } = require('discord.js');

const legendList = require('../../data/legends.json');

module.exports = {
	name: 'who',
	/**
	 *
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	run: async (client, message, args) => {
		const legends = [
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

		const id = Math.floor(Math.random() * legends.length);

		message.reply({ content: `Play as **${legendList[legends[id]].Name}** this round.` });
	},
};
