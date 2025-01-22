const { SlashCommandBuilder } = require('discord.js');
let config = require('../config.js'); // config モジュールをインポート

module.exports = {
    data: new SlashCommandBuilder()
        .setName('show_setting')
        .setDescription('設定を表示します'),
    async execute(interaction) {
        const channel_id=interaction.channelId;
        console.log(config);
        try {
            await interaction.reply(`CNN: ${config.config[channel_id].cnn}`);
        } catch (error) {
            await interaction.reply(`設定が見つかりませんでした。`);
        }
    },
};