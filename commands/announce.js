const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Announces a message to a channel.')
        .addStringOption(option => option
            .setName('message')
            .setDescription('The message to announce.')
            .setMinLength(1).setMaxLength(1950)
            .setRequired(true))
        .addBooleanOption(option => option
            .setName('everyone')
            .setDescription('Whether to mention everyone or not.')
            .setRequired(false)),
    async execute(interaction) {

        const userId = interaction.user.id;

        // Check if the user is the bot developer
        const isDeveloper = (userId === '176415859160383488');
    
        // Check if the user has the 'ADMINISTRATOR' permission in the server
        const memberPermissions = interaction.member.permissions;
        const isAdmin = memberPermissions.has(PermissionsBitField.Flags.Administrator);
    
        if (!isDeveloper && !isAdmin) {
            await interaction.reply({ content: 'You do not have the required permissions to use this command.', ephemeral: true });
            return;
        }
    
        const channel = interaction.channel;
        
        const messageContent = interaction.options.getString('message');
        const mentionEveryone = interaction.options.getBoolean('everyone') ?? false;

        const permissions = channel.permissionsFor(interaction.user);
        if (!permissions.has(PermissionsBitField.Flags.MentionEveryone) && mentionEveryone) {
            await interaction.reply({ content: `You don't have the permission to mention everyone in ${channel}.`, ephemeral: true });
            return;
        }

        try {
            await channel.send({ content: messageContent, allowedMentions: { parse: mentionEveryone ? ['everyone'] : [] } });
            await interaction.reply({ content: `Successfully announced message to ${channel}`, ephemeral: true });
        } catch (error) {
            console.error('Error announcing message:', error);
            await interaction.reply({ content: `Failed to announce message to ${channel}`, ephemeral: true });
        }
    }
};
