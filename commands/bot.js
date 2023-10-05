const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bot')
		.setDescription('Provides information about the bot.'),
	async execute(interaction) {
        const developerID = '176415859160383488'
        const developer = interaction.client.users.cache.get(developerID);
        const developerMember = interaction.guild.members.cache.get(developerID);
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		await interaction.reply({
			embeds: [
			new EmbedBuilder()
				.setDescription(`This bot was developed by one of the Chosen Absolute, **${developer.username}**, who joined on **${developerMember.joinedAt}**.\nOf course, I cannot tag him here because the mark commands that I do not disturb him.\nHe plans to add many more functions to make a more *smartor* little goblin :P.`)
				.setThumbnail(developer.avatarURL())
				.setFooter({
					text: 'Constructive feedback is also appreciated and should be sent to him.'
				})
		]
	});
	},
};
