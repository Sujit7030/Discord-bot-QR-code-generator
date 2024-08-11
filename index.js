require('dotenv').config();

const fs = require('fs');
const token = process.env['QR_BOT_TOKEN'];
const clientId = process.env['CLIENT_ID'];
const guildId = process.env['GUILD_ID'];

console.log('Token:', token);
console.log('Client ID:', clientId);
console.log('Guild ID:', guildId);

const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Load commands into client
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// When the client is ready, run this code
client.once('ready', () => {
    console.log('QR Bot has been logged in');
});

// Handle interactions
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'There was an error processing your command',
            ephemeral: true
        });
    }
});

// Login to Discord with your client's token
client.login(token);
