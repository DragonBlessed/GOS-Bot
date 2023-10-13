const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song'),
    async execute(interaction) {
        const player = interaction.client.player;
        const channel = interaction.member.voice.channel;

        if (!channel) {
            await interaction.reply('You are not connected to a voice channel!');
            return;
        }

        await interaction.deferReply();
        let embed = new EmbedBuilder();

        try {
            const queue = useQueue(interaction.guild.id);
            
            if (!queue || !queue.isPlaying) {
                embed.setDescription('No music is being played.');
            } else {
                const currentTrack = queue.currentTrack;
                const success = queue.node.skip()
                if (success) {
                    embed.setDescription(`Skipped: [${currentTrack.title}](${currentTrack.url})[${currentTrack.duration}]`)
                    .setThumbnail(currentTrack.thumbnail)
                    .setFooter({
                        text: `Requested by ${interaction.user.username} | Duration: ${currentTrack.duration}`
                    });
                } else {
                    embed.setDescription('Could not skip the current song.');
                }
            }
        } catch (e) {
            embed.setDescription(`Something went wrong: ${e.message}`);
        }

        await interaction.followUp({ embeds: [embed] });
    }
};
