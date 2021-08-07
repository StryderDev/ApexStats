const { CommandInteraction, MessageEmbed } = require('discord.js');
const axios = require('axios');
const { version } = require('../../package.json');
const { DateTime } = require('luxon');

module.exports = {
	name: 'legend',
	description: 'Show information about in-game legends.',

	options: [
		{
			name: 'legend',
			description: 'Select a legend.',
			type: 'STRING',
			required: true,
			choices: [
				{
					name: 'Bloodhound',
					value: 'bloodhound',
				},
				{
					name: 'Gibraltar',
					value: 'gibraltar',
				},
				{
					name: 'Lifeline',
					value: 'lifeline',
				},
				{
					name: 'Pathfinder',
					value: 'pathfinder',
				},
				{
					name: 'Wraith',
					value: 'wraith',
				},
				{
					name: 'Bangalore',
					value: 'bangalore',
				},
				{
					name: 'Caustic',
					value: 'caustic',
				},
				{
					name: 'Mirage',
					value: 'mirage',
				},
				{
					name: 'Octane',
					value: 'octane',
				},
				{
					name: 'Wattson',
					value: 'wattson',
				},
				{
					name: 'Crypto',
					value: 'crypto',
				},
				{
					name: 'Revenant',
					value: 'revenant',
				},
				{
					name: 'Loba',
					value: 'loba',
				},
				{
					name: 'Rampart',
					value: 'rampart',
				},
				{
					name: 'Horizon',
					value: 'horizon',
				},
				{
					name: 'Fuse',
					value: 'fuse',
				},
				{
					name: 'Valkyrie',
					value: 'valkyrie',
				},
				{
					name: 'Seer',
					value: 'seer',
				},
			],
		},
	],

	run: async (client, interaction) => {
		// Args
		const legend = interaction.options.get('legend');

		function getClass(className) {
			if (className == 'Offensive') return '<:offensive:837590674743230464>';
			if (className == 'Defensive') return '<:defensive:837590674945474631>';
			if (className == 'Support') return '<:support:837590675045220352>';
			if (className == 'Recon') return '<:recon:837590674882560020>';
		}

		axios.get(`https://api.apexstats.dev/legend?name=${legend.value}`).then(result => {
			var legend = result.data;

			const legendEmbed = new MessageEmbed()
				.setTitle(
					`${getClass(legend.info.class)} ${legend.info.name} (${legend.info.full_name}) - ${
						legend.fun.tagline
					}`,
				)
				.setDescription(legend.info.description)
				.addField('Age', legend.info.age.toString(), true)
				.addField('Entry Season', legend.info.entry_season, true)
				.addField('Home World', legend.info.home_world, true)
				.addField('Passive', legend.abilities.passive, true)
				.addField('Tactical', legend.abilities.tactical, true)
				.addField('Ultimate', legend.abilities.ultimate, true)
				.setImage(`https://cdn.apexstats.dev/LegendBanners/${legend.info.name}.png?q=${version}`)
				.setFooter(legend.fun.intro);

			interaction.followUp({ embeds: [legendEmbed] });
		});
	},
};
