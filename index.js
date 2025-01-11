const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: Object.values(GatewayIntentBits).reduce((a, b) => a | b)
});

client.on('ready', () => {
    console.log(`BOT is now runnnig.`);
});
client.on('messageCreate',async msg => {
     if(msg.author.bot) {
        return;
    }
    if(msg.content === "hello") {
        msg.reply("Hello \n https://www.cnn.co.jp/travel/35228107.html");
    }
});
process.on('uncaughtException', (err) => {
     console.log(`${err.stack}`);
});
require("dotenv").config();
client.login(process.env.TOKEN); //ログインする
