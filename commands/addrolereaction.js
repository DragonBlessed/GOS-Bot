
const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addrolereaction')
        .setDescription('Sends a message with reactions for users to add roles.')
        .addStringOption(option =>
            option
                .setName('message')
                .setDescription('The message to send.')
                .setRequired(true))
        .addStringOption(option => 
            option
                .setName('roles')
                .setDescription('The roles to add, separated by commas. Max: 5')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('emojis')
                .setDescription('The emojis corresponding to the roles, separated by commas.')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('title')
                .setDescription('The title of the embed.')
                .setRequired(false))
        .addStringOption(option =>
            option
                .setName('media')
                .setDescription('Add a gif/image url to the message.')
                .setRequired(false)),
    async execute(interaction) {
        try {
            const userId = interaction.user.id;

            // Check if the user is the bot developer
            const isDeveloper = (userId === '176415859160383488');
      
            // Check if the user has the 'ADMINISTRATOR' permission in the server
            const memberPermissions = interaction.member.permissions;
            const isAdmin = memberPermissions.has(PermissionsBitField.Flags.Administrator);
      
            if (!isDeveloper && !isAdmin) {
              await interaction.reply({ content: 'You do not have the required permissions to use this command.', ephemeral: true });
              return;
            }
            const messageContent = interaction.options.getString('message');
            
            const roles = interaction.options.getString('roles').split(', ').map(role => role.trim());
            const emojis = interaction.options.getString('emojis').split(', ').map(emoji => emoji.trim());

            
            const title = interaction.options.getString('title') || 'Roles';
            const media = interaction.options.getString('media');

            const embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(messageContent)
                .setFooter({ text: `Requested by ${interaction.user.username}` });

            if (media) {
                embed.setImage(media);
            }

            const message = await interaction.reply({ embeds: [embed], fetchReply: true });

            for (const [index, role] of roles.entries()) {
                await message.react(emojis[index].trim());
            }

            // Set up a filter to listen for reactions from the user who sent the command
            const filter = (reaction, user) => emojis.includes(reaction.emoji.name) && user.id === userId;

            // Create a reaction collector
            const collector = message.createReactionCollector({ filter });

            collector.on('collect', (reaction, user) => {
                const guild = reaction.message.guild;
                const emojiName = reaction.emoji.name;
                const roleIndex = emojis.indexOf(emojiName);
                const roleName = roles[roleIndex].trim();
                const role = guild.roles.cache.find(r => r.name.toLowerCase() === roleName.toLowerCase());
                const member = guild.members.cache.get(user.id);
                
                

                if (role && member.roles.cache.has(role.id)) {
                    member.roles.remove(role).catch(console.error);
                }

                else if (role) {
                    member.roles.add(role).catch(console.error);
                }
            });

            collector.on('end', collected => {
                console.log(`Collected ${collected.size} reactions`);
            });

        } catch (error) {
            console.error('An error occurred:', error);
            interaction.reply({ content: 'An error occurred while executing the command.', ephemeral: true });
        }
    },
};
