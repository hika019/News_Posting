const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
let config = require('../config.js'); // config モジュールをインポート

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set_channel')
        .setDescription('ニュースを送信するチャンネルを設定します')
        .addStringOption(option =>
            option.setName('channel_id')
                .setDescription('設定するチャンネルのID')
                .setRequired(true)),
    async execute(interaction) {
        const channelId = interaction.options.getString('channel_id');
        config.channel_id = channelId;

        // config.js ファイルを更新
        fs.writeFileSync('../config.js', `module.exports = ${JSON.stringify(config, null, 4)};`);

        await interaction.reply(`チャンネルIDが ${channelId} に設定されました。`);
    },
};