import React from 'react';
import './Menu.css'; // Menuのスタイルシートをインポート
import { fetchAwsData } from '../hooks/api.js';
import store, { StoreCLIValue } from '../store.js';
const Menu = () => {
  //CLI 処理ボタン
  const handleClick = async () => {
    try {
      const awsAccessKeyId = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
      const awsSecretAccessKey = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
      const awsRegion = process.env.REACT_APP_AWS_REGION;
      if (!awsAccessKeyId || !awsSecretAccessKey || !awsRegion) {
        throw new Error('AWS環境変数が設定されていません');
      }
      const data = await fetchAwsData(awsAccessKeyId, awsSecretAccessKey, awsRegion);
      console.log('AWS CLIデータ:', data);
      alert(data);
      store.dispatch(StoreCLIValue(data));
      console.log('ストアのCLIValue:', store.getState().CLIValue);
    } catch (error) {
      console.error('AWS CLIデータの取得に失敗しました:', error);
      alert('環境変数の取得に失敗しました。詳細はコンソールを確認してください。');
    }
  };


  return (
    <nav className="menu">
      メニュー
      <button onClick={handleClick}>クリック</button>
    </nav>
  );
};

export default Menu;