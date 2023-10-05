const { SlashCommandBuilder, embedLength } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

// Helper function to roll a die
function rollMultipleDice(amount, numberOfDice) {
    if (amount < 1) {
        return ["Invalid roll amount. Please enter a natural number."];
    }

    const rolls = [];
    for (let i = 0; i < numberOfDice; i++) {
        rolls.push(Math.floor(Math.random() * amount) + 1);
    }
    return rolls;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll up to a specified amount multiple times')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Maximum number you can roll up to')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('dice')
                .setDescription('Number of dice to roll')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('modifier')
                .setDescription('Add a modifier to the roll')
                .setRequired(false)),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        const numberOfDice = interaction.options.getInteger('dice');
        const modifier = interaction.options.getInteger('modifier') || 0;  // Default to 0 if not provided

        const rolls = rollMultipleDice(amount, numberOfDice);
        const total = rolls.reduce((a, b) => a + b, 0);
        const modifiedTotal = total + modifier;
        const totalAmount = amount * numberOfDice;

        if (rolls[0] === "Invalid roll amount. Please enter a natural number.") {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`${rolls[0]}`)
                ]
                }); // Return the error message
            return;
        }

        if (numberOfDice < 1) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("Invalid number of dice. Please enter a natural number.")
                ]
            }); // Return the error message
            return;
        }

        let responseEmbedDescription = modifier > 0 ? 
        `You rolled: [${rolls.join(', ')}] + ${modifier} for a total of ${modifiedTotal} out of ${totalAmount}!` :
        `You rolled: ${rolls.join(', ')} for a total of ${total} out of ${totalAmount}!`;
    
    if (modifiedTotal === 1 && modifier === 0) {
        responseEmbedDescription += ' Heheh, you are in the blood basket now, ya overgrown manlet!';
    }
    
    let response = {
        embeds: [
            new EmbedBuilder().setDescription(responseEmbedDescription)
        ]
    };
    
    await interaction.reply(response);
    
    },
};
