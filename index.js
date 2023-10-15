const fs = require('node:fs');
const path = require('node:path');
const { AttachmentBuilder, Client, Collection, Events, GatewayIntentBits, ActivityType } = require('discord.js');
const { token } = require('./config.json');
const { Routes } = require('discord-api-types/v9');
const {REST} = require('@discordjs/rest');
const { Player, QueryType } = require('discord-player');
require("dotenv").config();
const { YouTubeExtractor } = require('@discord-player/extractor');
const Canvas = require('@napi-rs/canvas');
const { request } = require('undici');




const client = new Client({ intents: [
	GatewayIntentBits.Guilds, 
	GatewayIntentBits.GuildMembers, 
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.GuildMessageReactions
] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandItems = fs.readdirSync(foldersPath);

for (const item of commandItems) {
  const itemPath = path.join(foldersPath, item);
  let commandFiles = [];
  
  // If the item is a directory, read its command files.
  if (fs.statSync(itemPath).isDirectory()) {
    commandFiles = fs.readdirSync(itemPath).filter(file => file.endsWith('.js')).map(file => path.join(itemPath, file));
  } 
  // If the item is a file, add it directly.
  else if (item.endsWith('.js')) {
    commandFiles.push(itemPath);
  }

  for (const filePath of commandFiles) {
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

const player = new Player(client);
client.player = player;

client.player.extractors.loadDefault();

player.extractors.loadDefault((ext) => ext !== 'YouTubeExtractor');

// Notify user when a track starts playing
player.events.on('playerStart', (queue, track) => {
  queue.metadata.channel.send(`Started playing **${track.title}**!`);
});


let status = [
	{
		name: "a violent drinking game",
		type: ActivityType.Playing
	},
	{
		name: "Dirgle crack some skulls",
		type: ActivityType.Watching
	},
	{
		name: "Volo's enchanting songs",
		type: ActivityType.Listening
	}
];

client.once(Events.ClientReady, () => {
  console.log('Ready!');
 client.user.setActivity(status[0]); 
  setInterval(() => {
	const randomStatus = Math.floor(Math.random() * status.length);
	client.user.setActivity(status[randomStatus]);
  }, 3600000);
});

let welcomemessages = [
	"Hope ya brought some Kragg for the rest of us, ",
	"How about you fling some dung on ye face to show that ya belong here, ",
	"Welcome to the Goblins of Seattle! How about we gobble ya up as a form of initiation, "
];

const applyText = (canvas, text) => {
	const context = canvas.getContext('2d');

	// Declare a base size of the font
	let fontSize = 70;

	do {
		// Assign the font to the context and decrement it so it can be measured again
		context.font = `bold ${fontSize -= 10}px Arial, sans-serif`;
    context.shadowColor = 'black';
    context.shadowBlur = 10;
    context.linewidth = 10;
    
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (context.measureText(text).width > canvas.width - 300);
  console.log(`Final font: ${context.font}`);  // Debugging line
	// Return the result to use in the actual canvas
	return context.font;
};

client.on("guildMemberAdd", async (member) => {
  const randomIndex = Math.floor(Math.random() * welcomemessages.length);
  const selectedMessage = welcomemessages[randomIndex];

  try {
    const avatarURL = member.user.displayAvatarURL({ format: 'jpg' });
    const buffer = await createWelcomeCanvas(member.user.username, avatarURL);
    const attachment = new AttachmentBuilder(buffer, 'welcome-image.png');

    const channel = await client.channels.fetch('702729548286132317');
    channel.send({ content: `${selectedMessage}${member.user.username}!`, files: [attachment] });
  } catch (error) {
    console.error("Error fetching or sending a message to the channel:", error);
  }
});


async function createWelcomeCanvas(username, avatarURL) {
  // Create a 700x250 pixel canvas and get its context
  const canvas = Canvas.createCanvas(700, 250);
  const context = canvas.getContext('2d');

  // Load and draw the background image
  const background = await Canvas.loadImage('./wallpaper.jpg');
  context.drawImage(background, 0, 0, canvas.width, canvas.height);

  // Draw other elements (rectangle, text, etc)
  context.strokeStyle = '#0099ff';
  context.strokeRect(0, 0, canvas.width, canvas.height);
  // add rectangle behind text
  context.fillStyle = 'rgba(0, 0, 0, 0.5)';
  if (username.length > 10) {
  context.fillRect(250, 25, canvas.width - 325, canvas.height - 75);
  } else {
    context.fillRect(250, 25, canvas.width - 300, canvas.height - 75);
  }
  context.font = 'bold 28px Arial, sans-serif';
  context.fillStyle = '#ffffff';
  context.fillText('Welcome', canvas.width / 2.5, canvas.height / 3.5);
  //context.font = applyText(canvas, `${username}!`);
  //context.fillText(`${username}!`, canvas.width / 2.5, canvas.height / 1.8);

  // Apply adaptive text for the username
  const appliedFont = applyText(canvas, `${username}!`);
  context.font = appliedFont;

  // Add text shadow properties
  context.shadowColor = 'rgba(0, 0, 0, 0.7)';  // Black color with 70% opacity
  context.shadowBlur = 4;                     // 4px blur radius
  context.shadowOffsetX = 2;                   // 2px right offset
  context.shadowOffsetY = 2;                   // 2px down offset

  context.fillStyle = '#ffffff';  // White text
  console.log(`Applied font for username: ${appliedFont}`);
  context.fillText(`${username}!`, canvas.width / 2.5, canvas.height / 1.8);

  context.save();

  // Clip for avatar
  context.beginPath();
  context.arc(125, 125, 100, 0, Math.PI * 2, true);
  context.closePath();
  context.clip();

  // Load and draw the avatar
  const { body } = await request(avatarURL);
  const avatar = await Canvas.loadImage(await body.arrayBuffer());
  context.drawImage(avatar, 25, 25, 200, 200);

  context.restore();
  // Return canvas buffer
  return await canvas.encode('png');
}

const eventsFolder = path.join(__dirname, 'events');
if (fs.existsSync(eventsFolder)) {
  const eventFiles = fs.readdirSync(eventsFolder).filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }
}

client.on(Events.MessageReactionAdd, async (reaction, user) => {
  if (reaction.partial) {
    try {
        await reaction.fetch();
    } catch (error) {
        console.error('Something went wrong when fetching the message:', error);
        return;
    }
  }
});


client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
      } else {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }
  }
  else if (interaction.isButton()) {
    const { customId, member } = interaction;

    if (customId.startsWith('addrole_')) {
      const roleToAdd = customId.split('_')[1];
      const role = interaction.guild.roles.cache.find(r => r.name.toLowerCase() === roleToAdd);
      
      
      if (role && member.roles.cache.has(role.id)) {
        await member.roles.remove(role);
        await interaction.reply({ content: `You have been removed from the ${role.name} role!`, ephemeral: true });
      }
      else if (role) {
        await member.roles.add(role);
        await interaction.reply({ content: `You have been given the ${role.name} role!`, ephemeral: true });
      } 
      else {
        await interaction.reply({ content: `Role ${roleToAdd} not found.`, ephemeral: true });
      }
    }
  }
});


client.login(token);
