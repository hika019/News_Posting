const { SlashCommandBuilder } = require('discord.js');
let config = require('../config.js'); // config モジュールをインポート

module.exports = {
    data: new SlashCommandBuilder()
        .setName('change_cnn')
        .setDescription('設定を表示します'),
    async execute(interaction) {
        if (config.cnn) {
            config.cnn = false;
        } else {
            config.cnn = true;
        }
        await interaction.reply(`CNN設定が ${config.cnn ? '有効' : '無効'} になりました。`);
    },
};