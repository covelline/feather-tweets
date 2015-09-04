# feather の定期ツイートを行うやつ

## 何する奴？

実行すると `tweets` ディレクトリの中にあるどれか1つのディレクトリの中にある情報を呟く.

ツイートの情報は

- `tweet.txt`: ツイートの本文
- `*.jpg`, `*.png`: ツイートに添付する画像 (最大4枚)
- 画像が添付されている場合は `tweet.txt` は無くても良い

である.

## 実行方法

このリポジトリをチェックアウトして

```sh
TW_CONSUMER_KEY=<consumer key> \
TW_CONSUMER_SECRET=<consumer  secret> \
TW_ACCESS_TOKEN_KEY=<access token> \
TW_ACCESS_TOKEN_SECRET=<access token secret> \
npm start
```

で実行できる.


`<consumer key>` などは予め `dev.twitter.com` で生成しておく.

## 定期ツイートの作り方

1. `tweets` の中に適当なディレクトリを作る
2. その中に `tweet.txt` を作りツイートの内容を書く
3. ツイートに添付したい画像がある場合は同じディレクトリに配置する

```
tweets
  |- 任意のディレクトリ
       |- tweet.txt
       |- hoge.png
       |- hoge.jpg
  |- 任意のディレクトリ
       |- tweet.txt
       |- hoge.png
       |- hoge.jpg
```

## LICENSE

プログラムのソースコードは MIT ですが、定期ツイートの内容や画像の無断使用は禁止します.
