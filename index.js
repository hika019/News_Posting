const path = require('node:path');
const fs = require('node:fs');
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { scrapeNewsList } = require('./cnn_scraping');


process.on('uncaughtException', (err) => {
    console.log(`${err.stack}`);
});
require("dotenv").config();


const client = new Client({ intents: [GatewayIntentBits.Guilds] });
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

client.on('messageCreate',async msg => {
     if(msg.author.bot) {
        return;
    }
    if(msg.content === "hello") {
        //msg.reply("Hello \n https://www.cnn.co.jp/travel/35228107.html");
        scrapeNewsList().then(result => {
            for (const news of result) {
                msg.reply(`Title: ${news.title}\nLink: ${news.link}\nDate: ${news.date}`);
            }
        });
    }
});

