import './Menu.css'; // Menuのスタイルシートをインポート
import { fetchAwsStackDetails, fetchAwsData } from '../../utils/api.js';
import store, { StoreCLIValue, StoreTaggleCLIValuesFlg } from '../../store.js';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import useCompareCLIValues from '../../hooks/useCompareCLIValues.js';

const Menu = () => {
  // ReduxのストアからCLIの値を取得
  const cliValue = useSelector(state => state.StoreCLIValue);
  // Reduxのストアから選択されたサービスを取得
  const selectedService = useSelector(state => state.SelectService);

  // カスタムフックを使用してフィルタリングされたCLIの値を取得
  const filteredValues = useCompareCLIValues();

  useEffect(() => {
    // CLIの値をコンソールに出力
    // console.log('CLI Value:', cliValue);
    // // 選択されたサービスをコンソールに出力
    // console.log('Selected Service:', selectedService);
    // // フィルタリングされたCLIの値をコンソールに出力
    // console.log('Filtered CLI Values:', filteredValues);
  }, [cliValue, selectedService, filteredValues]); // cliValueまたはselectedServiceが変更された場合に再実行

  //CLI 処理ボタン
  const handleClick = async () => {
    //cli処理開始flag
    store.dispatch(StoreTaggleCLIValuesFlg());
    try {
      const awsAccessKeyId = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
      const awsSecretAccessKey = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
      const awsRegion = process.env.REACT_APP_AWS_REGION;
      if (!awsAccessKeyId || !awsSecretAccessKey || !awsRegion) {
        throw new Error('AWS環境変数が設定されていません');
      }
      const stackDetails = await fetchAwsStackDetails(awsAccessKeyId, awsSecretAccessKey, awsRegion);
      console.log('AWS Stack Details:', stackDetails);
      
      // fetchAwsStackDetailsの結果が終わってからfetchAwsDataを実行
      const stackName = store.getState().StackName; 
      const cliCommand = `cloudformation describe-stack-resource-drifts --stack-name ${stackName} --stack-resource-drift-status-filters IN_SYNC MODIFIED DELETED NOT_CHECKED --output json`; // ハードコーディングされたCLIコマンド
      const data = await fetchAwsData(awsAccessKeyId, awsSecretAccessKey, awsRegion, cliCommand);
      
      // console.log('AWS CLIデータ:', data);
      store.dispatch(StoreCLIValue(data));
      console.log('ストアのCLIValue:', store.getState().StoreCLIValue);
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