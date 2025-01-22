const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const {config, base_config} = require('../config.js'); // config モジュールをインポート

module.exports = {
    data: new SlashCommandBuilder()
        .setName('del_channel')
        .setDescription('ニュースを送信するチャンネルを設定します'),
    async execute(interaction) {
        console.log(interaction.channelId);
        console.log(config);
        delete config[interaction.channelId]; // 設定を削除
        console.log(config);

        // config.js ファイルを更新
        fs.writeFileSync('../config.js', `module.exports = ${JSON.stringify(config, null, 4)};`);

        await interaction.reply(`設定を削除しました。`);
    },
};