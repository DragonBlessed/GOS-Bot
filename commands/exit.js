const {SlashCommandBuilder} = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('exit')
        .setDescription('Exits the Voice Channel'),
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
                const success = queue.delete();
                if (success) {
                    embed.setDescription(`Exited queue! The time will come when you will burn as you inject yourself upon the wooden stakes, and I shall be there to watch every minute, basking in your bath of the inferno, until you are gone from this world.`)
                    .setFooter({
                        text: `Requested by ${interaction.user.username}`
                    });
                } else {
                    embed.setDescription('Exited queue! The time will come when you will burn as you inject yourself upon the wooden stakes, and I shall be there to watch every minute, basking in your bath of the inferno, until you are gone from this world.')
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

    