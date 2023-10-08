const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

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
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('title')
        .setDescription('The title of the embed.')
        .setRequired(false))
    .addStringOption(option =>
      option
        .setName('media')
        .setDescription('Add a gif/image url to the message.')
        .setRequired(false)),
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

      const media = interaction.options.getString('media');
      const title = interaction.options.getString('title');

      // Media URL Validation
      const mediaExtensions = ['jpg', 'jpeg', 'png', 'gif'];
      if (media) {
        const url = new URL(media);  
        const extension = url.pathname.split('.').pop();
        if (!mediaExtensions.includes(extension.toLowerCase())) {
          await interaction.reply({ content: 'Invalid media extension. Only jpg, jpeg, png, and gif are supported.', ephemeral: true });
          return;
        }
      }
  
      // Title Length Check
      if (title && title.length > 256) {
        await interaction.reply({ content: 'Title too long, must be 256 characters or fewer.', ephemeral: true });
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
      
      if (media && title) {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(messageContent)
              .setImage(media)
              .setTitle(title)
          ],
          components: [row]
        });
      }
      else if (media) {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(messageContent)
              .setThumbnail(media)
          ],
          components: [row]
        });
      }
      else if (title) {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(messageContent)
              .setTitle(title)
          ],
          components: [row]
        });
      }
      else {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(messageContent)
          ],
          components: [row]
        });
      } 

    } catch (error) {
      // Handle general errors
      if (error instanceof TypeError && error.message.includes('Invalid URL')) {
        await interaction.reply({ content: 'Invalid media URL.', ephemeral: true });
        return;
      }
      console.error('Error in addrolesystem:', error);
      try {
        await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
      } catch (replyError) {
        console.error('Error while sending error message:', replyError);
      }
    }
  },  
};


