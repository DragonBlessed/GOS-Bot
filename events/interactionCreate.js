const { Events } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);

      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    } else if (interaction.isButton()) {
      const { customId, member } = interaction;

      if (customId.startsWith('addrole_')) {
        const roleToAdd = customId.split('_')[1];
        const role = interaction.guild.roles.cache.find(r => r.name.toLowerCase() === roleToAdd);
        
        if (role) {
          await member.roles.add(role);
          await interaction.reply({ content: `You have been given the ${role.name} role!`, ephemeral: true });
        } else {
          await interaction.reply({ content: `Role ${roleToAdd} not found.`, ephemeral: true });
        }
      }
    }
  },
};
