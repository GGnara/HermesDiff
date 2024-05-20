import express from 'express';
import { exec } from 'child_process';
import dotenv from 'dotenv';
import cors from 'cors';

// .envファイルから環境変数を読み込む
dotenv.config();

const app = express();
const port = 53906; // ポートを53906に設定

// CORSを有効にする
app.use(cors());

app.get('/execute-aws-cli', (req, res) => {
  const command = `aws s3 ls --region ${process.env.AWS_REGION}`;
  exec(command, {
    env: {
      ...process.env,
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    }
  }, (error, stdout, stderr) => {
    if (error) {
      res.status(500).send(`エラーが発生しました: ${error.message}`);
      return;
    }
    if (stderr) {
      res.status(500).send(`標準エラー出力: ${stderr}`);
      return;
    }
    res.send(`コマンドの出力: ${stdout}`);
  });
});

app.listen(port, () => {
  console.log(`サーバーがポート${port}で起動しました`);
});