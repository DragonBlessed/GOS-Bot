const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear messages in a channel')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Number of messages to clear')
                .setRequired(true)),
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

        const amount = interaction.options.getInteger('amount');

        if (amount <= 0 || amount > 100) {
            return interaction.reply('You can only clear between 1 and 100 messages.', { ephemeral: true });
        }

        const channel = interaction.channel;
        const messages = await channel.messages.fetch({ limit: amount });

        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

        const messagesToDelete = messages.filter(message => message.createdTimestamp > twoWeeksAgo.getTime());

        if (messagesToDelete.size === 0) {
            return interaction.reply('No messages found within the last 14 days.', { ephemeral: true });
        }

        await channel.bulkDelete(messagesToDelete);

        interaction.reply(`Cleared ${messagesToDelete.size} messages.`, { ephemeral: true });
    },
};