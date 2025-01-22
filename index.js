const path = require('node:path');
const fs = require('node:fs');
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { scrapeNewsList } = require('./cnn_scraping');
let config = require('./config.js');

process.on('uncaughtException', (err) => {
    console.error(`${err.stack}`);
});
require("dotenv").config();


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});
client.login(process.env.TOKEN); //ログインする
client.on('ready', () => {
    console.log(`BOT is now runnnig.`);
});

client.commands = new Collection();
const commandPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    }else {
        console.log(`Command ${file} is invalid.`);
    }
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`${interaction.commandName} が見つかりません。`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'エラーが発生しました。', ephemeral: true });
	}
});

const sendMessageToAllServers = async (message) => {
    client.guilds.cache.forEach(async guild => {
        const channel = client.channels.cache.get(config.channel_id);
        if (channel) {
            await channel.send(message);
        }
    });
};

const setdMessageToStgServer = async (message) => {
    const channel = client.channels.cache.get(config.channel_id);
    client.channels.cache.forEach(async channel => {
        console.log(channel.id);
    });

    if (!channel){
        try {
            channel = await client.channels.fetch(config.channel_id);
        } catch (error) {
            console.error(`Failed to fetch channel: ${config.channel_id}`, error);
        }
    }

    console.log("setdMessageToStgServer", message);
    if (channel) {
        await channel.send(message);
    }else{
        console.log('channel is not found');
    }
}

lastExecutionTime= new Date('2025-01-22 00:00:00');
setInterval(async () => {
    if (config.cnn) {
        console.log(new Date(), 'Checking CNN news...');

        const newsList = await scrapeNewsList();
        const newArticles = newsList.filter(news => new Date(news.date) > lastExecutionTime);
        lastExecutionTime = new Date();

        if (newArticles.length > 0) {
            for (const news of newArticles) {
                setdMessageToStgServer(`Title: ${news.title}\nLink: ${news.link}\nDate: ${news.date}`);
                //await interaction.channel.send(`Title: ${news.title}\nLink: ${news.link}\nDate: ${news.date}`);
            }
        } else {
            //channel.send('新しい記事はありません。');
        }
    }
}, config.polling_time_sec * 1000);

