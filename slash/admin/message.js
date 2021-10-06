const { Client, CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
	name: 'sendmessage',
	description: 'Used for pre-configuring modules.',
	type: 'CHAT_INPUT',
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		const embed = new MessageEmbed()
			.setTitle('Module Title')
			.setDescription('This will be updated when the module is configured.');

		await interaction.followUp({ embeds: [embed] }).catch(e => interaction.editReply(e));
	},
};
