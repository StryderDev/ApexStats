const { Axiom } = require('@axiomhq/js');
const wait = require('util').promisify(setTimeout);
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const guns = require('../../data/guns.json');
const { embedColor, Misc } = require('../../data/utilities.json');

const axiomIngest = new Axiom({
	token: process.env.AXIOM_TOKEN,
	orgId: process.env.AXIOM_ORG,
});

module.exports = {
	data: new SlashCommandBuilder().setName('guns').setDescription('Select a random gun loadout.'),

	async execute(interaction) {
		const loadingEmbed = new EmbedBuilder().setDescription(`${Misc.Loading} Selecting a random loadout...`);

		await interaction.editReply({ embeds: [loadingEmbed] });

		await wait(1000);

		const firstGun = Math.floor(Math.random() * guns.length);
		const secondGun = Math.floor(Math.random() * guns.length);

		const firstText = guns[firstGun];
		const secondText = guns[secondGun];

		await interaction.editReply({ content: `Use the **${firstText}** and the **${secondText}** this round.`, embeds: [] });

		axiomIngest.ingest('apex.stats', [{ firstGun: firstText, secondGun: secondText }]);
	},
};
