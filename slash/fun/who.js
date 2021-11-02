const { Client, CommandInteraction } = require('discord.js');

module.exports = {
	name: 'who',
	description: 'Returns a random legend to play as in-game.',
	type: 'CHAT_INPUT',
	options: [
		{
			name: 'type',
			type: 'STRING',
			description: 'Choose a legend group to pick from.',
			require: false,
			choices: [
				{
					name: 'Offensive',
					value: 'Offensive',
				},
				{
					name: 'Defensive',
					value: 'Defensive',
				},
				{
					name: 'Support',
					value: 'Support',
				},
				{
					name: 'Recon',
					value: 'Recon',
				},
			],
		},
	],
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		const type = args[0];

		const legends = [
			'Bloodhound',
			'Gibraltar',
			'Lifeline',
			'Pathfinder',
			'Wraith',
			'Bangalore',
			'Caustic',
			'Mirage',
			'Octane',
			'Wattson',
			'Crypto',
			'Revenant',
			'Loba',
			'Rampart',
			'Horizon',
			'Fuse',
			'Valkyrie',
			'Seer',
			'Ash',
		];
		const legend = legends[Math.floor(Math.random() * legends.length)];

		const offensiveList = ['Bloodhound', 'Wraith', 'Mirage', 'Octane', 'Revenant', 'Horizon', 'Fuse', 'Ash'];
		const offensive = offensiveList[Math.floor(Math.random() * offensiveList.length)];

		const defensiveList = ['Gibraltar', 'Caustic', 'Wattson', 'Rampart'];
		const defensive = defensiveList[Math.floor(Math.random() * defensiveList.length)];

		const supportList = ['Lifeline', 'Loba'];
		const support = supportList[Math.floor(Math.random() * supportList.length)];

		const reconList = ['Bloodhound', 'Pathfinder', 'Crypto', 'Valkyrie', 'Seer'];
		const recon = reconList[Math.floor(Math.random() * reconList.length)];

		if (!type) {
			await interaction
				.followUp({ content: 'Choosing a Legend...' })
				.then(i => interaction.editReply(`Play as **${legend}** this round.`))
				.catch(e => interaction.editReply(e));
		} else if (type == 'Offensive') {
			await interaction
				.followUp({ content: 'Choosing an Offensive Legend...' })
				.then(i => interaction.editReply(`Play as **${offensive}** this round.`))
				.catch(e => interaction.editReply(e));
		} else if (type == 'Defensive') {
			await interaction
				.followUp({ content: 'Choosing a Defensive Legend...' })
				.then(i => interaction.editReply(`Play as **${defensive}** this round.`))
				.catch(e => interaction.editReply(e));
		} else if (type == 'Support') {
			await interaction
				.followUp({ content: 'Choosing a Support Legend...' })
				.then(i => interaction.editReply(`Play as **${support}** this round.`))
				.catch(e => interaction.editReply(e));
		} else if (type == 'Recon') {
			await interaction
				.followUp({ content: 'Choosing a Recon Legend...' })
				.then(i => interaction.editReply(`Play as **${recon}** this round.`))
				.catch(e => interaction.editReply(e));
		}
	},
};
