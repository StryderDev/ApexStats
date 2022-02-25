const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const wait = require('util').promisify(setTimeout);

module.exports = {
	data: new SlashCommandBuilder().setName('who').setDescription('Pick a random legend to play.'),
	async execute(interaction) {
		const loadingEmbed = new MessageEmbed().setDescription(
			`<a:ApexBot_Loading:940037271980220416> Choosing a random legend...`,
		);

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
			'Mad Maggie',
		];

		const legend = Math.floor(Math.random() * legends.length);
		const legendEmbed = new MessageEmbed()
			.setDescription(`Play **${legends[legend]}** this round!`)
			.setImage(`https://cdn.apexstats.dev/Bot/Legends/Banners/${encodeURIComponent(legends[legend])}.png`);

		await interaction.editReply({ embeds: [loadingEmbed] });
		await wait(1000);
		await interaction.editReply({ embeds: [legendEmbed] });
	},
};
