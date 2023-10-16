const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const xml2js = require('xml2js');  
const { EmbedBuilder } = require('discord.js');
const cheerio = require('cheerio');

let counter = 0;

async function fetchAndLogSourceContent(sourceUrl) {
    try {
        const response = await axios.get(sourceUrl); 
        const $ = cheerio.load(response.data); // load html into cheerio
        // check if the first image is a relative path, if so, append the base url
        let imageUrl = $('img').first().attr('src');
        if (imageUrl && imageUrl.startsWith('/')) {
            const baseUrl = new URL(sourceUrl).origin;
            imageUrl = baseUrl + imageUrl;
        }
        return imageUrl;
    } catch (error) {
        console.error('Error fetching source content:', error);
        return null;
    }
}

async function fetchNewsRSS(animeName) {
    try {
        const response = await axios.get(`http://news.google.com/news?q=${encodeURIComponent(animeName)}&output=rss`);
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(response.data);
        const newsItems = result?.rss?.channel?.[0]?.item || []; // return link, title, and source url from first article

        const newsArray = newsItems
            .filter(item => !item?.source?.[0]?.$?.url?.includes('crunchyroll.com')) // Filter out Crunchyroll
            .map(item => ({
                newsLink: item?.link?.[0],
                newsTitle: item?.title?.[0],
                newsSourceUrl: item?.source?.[0]?.$?.url
            }));

        return newsArray;
    } catch (error) {
        console.error('Error fetching RSS:', error);
        return [];
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('getanimenews')
        .setDescription('Provides the link to a news article page for the given anime.')
        .addStringOption(option => 
            option.setName('anime')
                .setDescription('Name of the anime')
                .setRequired(true)),
    async execute(interaction) {
        if (counter >= 80) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription('Too many queries each day means too much costs for the Absolute. Try again in 24 hours.')
                        .setThumbnail('https://cdn.mos.cms.futurecdn.net/8MonXm7hwis8QpALHm4NQN.jpg')
                ]
            });
            return; // exit early to prevent further processing
        }

        try {
            const animeName = interaction.options.getString('anime');
            if (!animeName || animeName.length <= 1 || animeName.length > 100 || animeName === 'null' || animeName === 'undefined' || animeName === 'NaN' || animeName.match(/[^a-zA-Z0-9 :;'-.!]/g)) {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setDescription('Invalid anime name. Please enter a valid anime name.')
                        .setThumbnail('https://cdn.mos.cms.futurecdn.net/8MonXm7hwis8QpALHm4NQN.jpg')
                    ]
                });
                return;
            }

            const newsArray = await fetchNewsRSS(animeName);
            let newsLink, newsTitle, newsImage;

            // loop through the news array to find a news article with a valid link and image
            for (const newsItem of newsArray) {
                newsLink = newsItem.newsLink;
                newsTitle = newsItem.newsTitle;
                newsImage = await fetchAndLogSourceContent(newsItem.newsSourceUrl);
                if (newsLink && (newsImage && (newsImage.startsWith('http:') || newsImage.startsWith('https:')))) {
                    break;
                }
            }

            if (!newsLink) {
                await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`No news article found for ${animeName}.`)
                        .setThumbnail('https://cdn.mos.cms.futurecdn.net/8MonXm7hwis8QpALHm4NQN.jpg')
                ]
                });
                return;
            }

            const embed = new EmbedBuilder()
                        .setDescription(`[**${newsTitle}**](${newsLink})`)
                        .setFooter({
                            text: `Requested by ${interaction.user.username} for [${animeName}]`
                        });
                        
            if (newsImage && (newsImage.startsWith('http:') || newsImage.startsWith('https:'))) {
                embed.setThumbnail(newsImage);
            }

            await interaction.reply({
                embeds: [embed]
            });
            counter++; // Counter to prevent too many queries each day

        } catch (error) {
            console.error('Error fetching news link:', error);
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription('There was an error fetching the link. Please try again later.')
                ]
            });
        }
    }
};