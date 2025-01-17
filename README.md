# 概要
`https://www.cnn.co.jp/archives/`の記事のリンクとタイトルをDiscordに投げるBOT

# BOT実行方法

1. `.env`の中を追記する
1. nodeがインストールされている環境で下記を実行
    ```bash
    $ node -v
    v23.6.0

    $npm install
    ```

1. コマンドの登録
   ```bash
    node deploy_command.js
   ```

1. BOT起動
    ```bash
    node index.js
    ```

# BOT　Command

## 設定の確認

```text
/show_setting
```

## チャンネルIDの登録

```text
/set_channel ${チャンネルID}
```

## CNNのスクレイピングを有効・無効切り替え

```text
/change_cnn
```
