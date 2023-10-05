const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const xml2js = require('xml2js');  
const { EmbedBuilder } = require('discord.js');
const cheerio = require('cheerio');

let counter = 0;

async function fetchAndLogSourceContent(sourceUrl) {
    try {
        const response = await axios.get(sourceUrl);
        const $ = cheerio.load(response.data); // Load the HTML content into cheerio

        // extract the image from the page
        let imageUrl = $('img').first().attr('src');

        // Check if the URL is relative
        if (imageUrl && imageUrl.startsWith('/')) {
            // Extract the base URL (domain) from the source URL
            const baseUrl = new URL(sourceUrl).origin;
            imageUrl = baseUrl + imageUrl;
        }

        console.log("Extracted Image URL:", imageUrl);

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

        
        // Return the link and title to the first news article
        const newsLink = result?.rss?.channel?.[0]?.item?.[0]?.link?.[0];
        const newsTitle = result?.rss?.channel?.[0]?.item?.[0]?.title?.[0];
        const newsSourceUrl = result?.rss?.channel?.[0]?.item?.[0]?.source?.[0]?.$?.url;
        const newsImage = await fetchAndLogSourceContent(newsSourceUrl); // Fetch and log the content
        console.log(newsLink)
        console.log(newsSourceUrl)

        

        return { newsLink, newsTitle, newsImage };
    } catch (error) {
        console.error('Error fetching RSS:', error);
        return null;
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
            return; // Exit early to prevent further processing
        }

        try {
            const animeName = interaction.options.getString('anime');
            if (!animeName || animeName.length <= 1 || animeName.length > 100 || animeName === 'null' || animeName === 'undefined' || animeName === 'NaN' || animeName.match(/[^a-zA-Z0-9 ]/g)) {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setDescription('Invalid anime name. Please enter a valid anime name.')
                        .setThumbnail('https://cdn.mos.cms.futurecdn.net/8MonXm7hwis8QpALHm4NQN.jpg')
                    ]
                });
                return;
            }
            const { newsLink, newsTitle, newsImage } = await fetchNewsRSS(animeName);
            

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


            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`[**${newsTitle}**](${newsLink})`)
                        .setFooter({
                            text: `Requested by ${interaction.user.username} for [${animeName}]`
                        })
                        .setThumbnail(newsImage)
                ]
            });
            counter++;  // Increment the counter for every executed query

        } catch (error) {
            console.error('Error fetching news link:', error);
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription('There was an error fetching the link. Please try again later.')
                        .setThumbnail('https://cdn.mos.cms.futurecdn.net/8MonXm7hwis8QpALHm4NQN.jpg')
                ]
            });
        }
    }
}

