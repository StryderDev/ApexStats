const wait = require('util').promisify(setTimeout);
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const guns = require('../../data/guns.json');
const legendFile = require('../../data/legends/all.json');
const { embedColor, Misc } = require('../../data/utilities.json');

module.exports = {
	data: new SlashCommandBuilder().setName('loadout').setDescription('Select a random legend and gun loadout.'),

	async execute(interaction) {
		const loadingEmbed = new EmbedBuilder().setDescription(`${Misc.Loading} Selecting a random loadout...`).setColor(embedColor);

		await interaction.editReply({ embeds: [loadingEmbed] });

		await wait(1000);

		const firstGun = Math.floor(Math.random() * guns.length);
		const secondGun = Math.floor(Math.random() * guns.length);
		const legend = Math.floor(Math.random() * legendFile.length);

		const firstText = guns[firstGun];
		const secondText = guns[secondGun];

		const loadoutEmbed = new EmbedBuilder()
			.addFields([
				{ name: 'Legend', value: `- ${legendFile[legend]}`, inline: true },
				{ name: 'Weapons', value: `- ${firstText}\n- ${secondText}`, inline: true },
			])
			.setImage(
				`https://specter.apexstats.dev/ApexStats/Legends/${encodeURIComponent(legendFile[legend])}.png?t=${Math.floor(Math.random() * 10) + 1}&key=${process.env.SPECTER}`,
			)
			.setColor(embedColor);

		await interaction.editReply({ embeds: [loadoutEmbed] });
	},
};
