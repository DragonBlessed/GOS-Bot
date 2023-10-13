const {SlashCommandBuilder} = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the current song'),
        async execute(interaction) {
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
                    const success = queue.node.setPaused(!queue.node.isPaused());
                    if (success) {
                        embed.setDescription(`Paused/Unpaused queue!`)
                        .setFooter({
                            text: `Requested by ${interaction.user.username}`
                        });    
                    }
                    else {
                        embed.setDescription('Error pausing queue!')
                        .setFooter({
                            text: `Requested by ${interaction.user.username}`
                        });
                    }
                }
            } catch (e) {
                embed.setDescription(`Something went wrong: ${e.message}`);
            }
    
            await interaction.followUp({ embeds: [embed] });
    
        }}