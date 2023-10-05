const {SlashCommandBuilder} = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('exit')
        .setDescription('Exits the Voice Channel - NOT WORKING ATM'),
    async execute(interaction, client) {
        const queue = await client.player.getQueue(interaction.guild);

        if (!queue || !queue.playing) {
            await interaction.reply('No music is playing!');
            return;
        }

        queue.destroy();

        await interaction.reply("The time will come when you will burn amongst the stakes, and I shall be there to watch every minute until you are gone from this world.");
    }}