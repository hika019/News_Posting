const { SlashCommandBuilder } = require('discord.js');
let config = require('../config.js'); // config モジュールをインポート

module.exports = {
    data: new SlashCommandBuilder()
        .setName('change_cnn')
        .setDescription('設定を表示します'),
    async execute(interaction) {
        const channel_id=interaction.channelId;
        if (config.config[channel_id].cnn) {
            config.config[channel_id].cnn = false;
        } else {
            config.config[channel_id].cnn = true;
        }
        await interaction.reply(`CNN設定が ${config.config[channel_id].cnn ? '有効' : '無効'} になりました。`);
    },
};