import express from 'express';
import { exec } from 'child_process';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

// .envファイルから環境変数を読み込む
dotenv.config();

const app = express();
const port = 53906; // ポートを53906に設定

// CORSを有効にする
app.use(cors());

app.get('/execute-aws-cli-stack-details', (req, res) => {
  const accessKeyId = req.headers['x-aws-access-key-id'];
  const secretAccessKey = req.headers['x-aws-secret-access-key'];
  const region = req.headers['x-aws-region'];
  const stackName = req.headers['x-stack-name'];

  if (!accessKeyId || !secretAccessKey || !region) {
    res.status(400).send('必要なヘッダーが不足しています');
    return;
  }
  const command = `aws cloudformation describe-stack-resources --stack-name ${stackName} --query "StackResources[*].[LogicalResourceId,PhysicalResourceId,ResourceType]" --output json --region ${region}`;
  exec(command, {
    env: {
      ...process.env,
      AWS_ACCESS_KEY_ID: accessKeyId,
      AWS_SECRET_ACCESS_KEY: secretAccessKey,
    }
  }, (error, stdout, stderr) => {
    if (error) {
      console.error(`エラーが発生しました: ${error.message}`);
      res.status(500).send(`エラーが発生しました: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`標準エラー出力: ${stderr}`);
      res.status(500).send(`標準エラー出力: ${stderr}`);
      return;
    }
    res.setHeader('Content-Type', 'application/json'); // JSON形式で返す
    res.send(stdout); // コマンドの出力をそのまま送信
  });
});

// 新しいエンドポイントを追加
app.get('/execute-aws-cli', (req, res) => {
  const accessKeyId = req.headers['x-aws-access-key-id'];
  const secretAccessKey = req.headers['x-aws-secret-access-key'];
  const region = req.headers['x-aws-region'];
  const cliCommand = req.headers['x-cli-command'];

  if (!accessKeyId || !secretAccessKey || !region || !cliCommand) {
    res.status(400).send('必要なヘッダーが不足しています');
    return;
  }

  const command = `aws ${cliCommand} --region ${region}`;
  console.log(`実行するコマンド: ${command}`); // コマンドをログに出力
  exec(command, {
    env: {
      ...process.env,
      AWS_ACCESS_KEY_ID: accessKeyId,
      AWS_SECRET_ACCESS_KEY: secretAccessKey,
    }
  }, (error, stdout, stderr) => {
    if (error) {
      console.error(`エラーが発生しました: ${error.message}`);
      console.error(`標準エラー出力: ${stderr}`);
      res.status(500).send(`エラーが発生しました: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`標準エラー出力: ${stderr}`);
      res.status(500).send(`標準エラー出力: ${stderr}`);
      return;
    }
    res.setHeader('Content-Type', 'application/json'); // JSON形式で返す
    res.send(stdout); // コマンドの出力をそのまま送信
  });
});

// CFnのYAMLファイルリストを取得するエンドポイント
app.get('/list-cfn-yaml', (req, res) => {
  const cfnYamlDir = path.join(process.cwd(), 'public/CfnYaml');
  fs.readdir(cfnYamlDir, (err, files) => {
    if (err) {
      console.error('ディレクトリの読み取りエラー:', err);
      res.status(500).send('CFnのYAMLファイルリストの取得に失敗しました');
      return;
    }

    const yamlFiles = files
      .filter(file => file.endsWith('.yaml') || file.endsWith('.yml'))
      .map(file => file.replace(/\.(yaml|yml)$/, ''));
    res.json(yamlFiles);
  });
});


app.listen(port, () => {
  console.log(`サーバーがポート${port}で起動しました`);
});