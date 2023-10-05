const {SlashCommandBuilder} = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the current song - NOT WORKING ATM'),
    async execute(interaction, client) {
        const queue = await client.player.getQueue(interaction.guild);

        if (!queue || !queue.playing) {
            await interaction.reply('No music is playing!');
            return;
        }

        const CurrentSong = queue.current;

        queue.setPaused(true);

        await interaction.reply("The current song has been paused!");
    }}