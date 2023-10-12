const { SlashCommandBuilder } = require('discord.js');
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
            option.setName('totalmodifier')
                .setDescription('Add a modifier to the total roll amount')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('individualmodifier')
                .setDescription('Add a modifier to each individual roll')
                .setRequired(false)),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        const numberOfDice = interaction.options.getInteger('dice');
        const modifier = interaction.options.getInteger('totalmodifier') || 0;  // Default to 0 if not provided
        const individualModifier = interaction.options.getInteger('individualmodifier') || 0;  // Default to 0 if not provided

        const rolls = rollMultipleDice(amount, numberOfDice);
        const rollsWithIndividualModifiers = rolls.map(roll => roll + individualModifier);
        const total = rollsWithIndividualModifiers.reduce((a, b) => a + b, 0);
        const modifiedTotal = total + modifier;
        const totalAmount = amount * numberOfDice;

        const rollsWithModifiersStrings = rolls.map((roll, index) => `${roll}+${individualModifier}`);

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
        `You rolled: [${rollsWithModifiersStrings.join(', ')}] + ${modifier} for a total of ${modifiedTotal} out of ${totalAmount}!` :
        `You rolled: [${rollsWithModifiersStrings.join(', ')}] for a total of ${total} out of ${totalAmount}!`;
    
        if (modifiedTotal === 1 && modifier === 0 && individualModifier === 0) {
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
