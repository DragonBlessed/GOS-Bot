const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Provides information about the user.'),
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		await interaction.reply({
			embeds: [
			new EmbedBuilder()
				.setTitle(`User info for ${interaction.user.username}`)
				.setDescription(`This user is ${interaction.user.username} and has the ID ${interaction.user.id}.\nThey joined on ${interaction.member.joinedAt}.`)
				.setThumbnail(interaction.user.avatarURL())
		]
		});
	},
};