const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addrolesystem')
    .setDescription('Sends a message to add roles to yourself.')
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('The message to send.')
        .setRequired(true))
    .addStringOption(option => 
      option
        .setName('roles')
        .setDescription('The roles to add, separated by commas. Max: 5')
        .setRequired(true)),
  async execute(interaction) {
    try {
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

      const roles = interaction.options.getString('roles');
      const messageContent = interaction.options.getString('message'); 
      const colors = ['Primary', 'Secondary', 'Success', 'Danger']; 
      const roleArray = roles.split(', ');

      const row = new ActionRowBuilder();
      for (let i = 0; i < roleArray.length; i++) {
        roleArray[i] = roleArray[i].toLowerCase();
        const button = new ButtonBuilder()
          .setStyle(colors[i % colors.length])
          .setLabel(roleArray[i])
          .setCustomId(`addrole_${roleArray[i]}`);
        row.addComponents(button);
      }
      
      await interaction.reply({
        content: messageContent,
        components: [row]
      });

    } catch (error) {
      console.error('Error in addrolesystem:', error);
      try {
        await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
      } catch (replyError) {
        console.error('Error while sending error message:', replyError);
      }
    }
  }
};


// Add embeds to the addrolesystem command