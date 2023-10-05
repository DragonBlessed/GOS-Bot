const {SlashCommandBuilder} = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resumes the current song - NOT WORKING ATM'),
    async execute(interaction, client) {
        const queue = await client.player.getQueue(interaction.guild);

        if (!queue || !queue.playing) {
            await interaction.reply('No music is playing!');
            return;
        }

        const CurrentSong = queue.current;

        queue.setPaused(false);

        await interaction.reply("Resumed playing.");
    }}