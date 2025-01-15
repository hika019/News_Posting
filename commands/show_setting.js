const { SlashCommandBuilder } = require('discord.js');
let config = require('../config.js'); // config モジュールをインポート

module.exports = {
    data: new SlashCommandBuilder()
        .setName('show_setting')
        .setDescription('設定を表示します'),
    async execute(interaction) {
        await interaction.reply(`設定\n投票時間: ${config.polling_time_sec}秒\nCNN: ${config.cnn}\nチャンネルID: ${config.channel_id}`);
    },
};