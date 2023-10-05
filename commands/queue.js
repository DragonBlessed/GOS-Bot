const {SlashCommandBuilder} = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Shows the current queue - NOT WORKING ATM'),
    async execute(interaction, client) {
    const queue = client.player.GetQueue(interaction.guild);

    if (queue || !queue.playing) {
        await interaction.reply('No music is playing!');
        return;
    }

    const queueString = queue.tracks.slice(0, 10).map((song, i) => {
        return `${i + 1}) [${song.duration}]\` ${song.title} - ${song.author} - <@${song.requestedBy}>`;
    }).join('\n');
    
    const CurrentSong = queue.current;

    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setDescription(`**Now Playing:** [${CurrentSong.title}] - <@${currentSong.requestedBy.id}>\n(${CurrentSong.url})\n\n**Queue:**\n${queueString}`)
                .setThumbnail(CurrentSong.thumbnail)
        ]
    })
    }
}