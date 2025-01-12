const { REST, Routes } = require('discord.js');
process.on('uncaughtException', (err) => {
	console.log(`${err.stack}`);
});
require("dotenv").config();
const fs = require('node:fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
	try {
		console.log(`${commands.length} 個のアプリケーションコマンドを登録します。`);

		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
			{ body: commands },
		);

		console.log(`${data.length} 個のアプリケーションコマンドを登録しました。`);
	} catch (error) {
		console.error(error);
	}
})();
