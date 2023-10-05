const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song')
        .addSubcommand(subcommand =>
            subcommand
                .setName('song')
                .setDescription('Play a song from YT')
                .addStringOption(option =>
                    option
                        .setName('url')
                        .setDescription('song url')
                        .setRequired(true))),
    async execute(interaction) {
        const player = interaction.client.player;
        const channel = interaction.member.voice.channel;

        if (!channel) {
            await interaction.reply('You are not connected to a voice channel!');
            return;
        }

        const query = interaction.options.getString('url', true);
        await interaction.deferReply();

        let result;
        let embed = new EmbedBuilder();

        switch (interaction.options.getSubcommand()) {
            case 'song':
                try {
                    result = await player.play(channel, query, {
                        nodeOptions: { metadata: interaction },
                        searchEngine: QueryType.YOUTUBE_VIDEO
                    });

                    embed = embed.setDescription(`Queued [${result.track.title}](${result.track.url}) [${result.track.duration}]`)
                              .setThumbnail(result.track.thumbnail)
                              .setFooter({
                                  text: `Requested by ${interaction.user.username} | Duration: ${result.track.duration}`
                              });
                } catch (e) {
                    embed = embed.setDescription(`Something went wrong: ${e.message}`);
                }
                break;

            case 'playlist':
                try {
                    result = await player.play(channel, query, {
                        nodeOptions: { metadata: interaction },
                        searchEngine: QueryType.YOUTUBE_PLAYLIST
                    });

                    embed = embed.setDescription(`Queued playlist [${result.playlist.title}](${result.playlist.url}) with ${result.tracks.length} songs.`)
                              .setThumbnail(result.playlist.thumbnail)
                              .setFooter({
                                  text: `Requested by ${interaction.user.username}`
                              });
                } catch (e) {
                    embed = embed.setDescription(`Something went wrong: ${e.message}`);
                }
                break;

            case 'search':
                try {
                    result = await player.play(channel, query, {
                        nodeOptions: { metadata: interaction },
                        searchEngine: QueryType.AUTO
                    });

                    embed = embed.setDescription(`Queued [${result.track.title}](${result.track.url}) [${result.track.duration}] from search.`)
                              .setThumbnail(result.track.thumbnail)
                              .setFooter({
                                  text: `Requested by ${interaction.user.username} | Duration: ${result.track.duration}`
                              });
                } catch (e) {
                    embed = embed.setDescription(`Something went wrong: ${e.message}`);
                }
                break;
        }

        await interaction.followUp({ embeds: [embed] });
    }
};
