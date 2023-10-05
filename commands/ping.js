const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('greet')
    .setDescription('get ready for a surprise, human.'),
  async execute(interaction) {
    await interaction.reply(`You shitey feck-shite, ${interaction.user.username}! I\'ll rip ye bloody head off and make it consume dung! Then I will feed the remains of your body to Drog Ragzlin himself!`);
  },
};