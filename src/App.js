/**
 * src/App.js
 */
// Start of Selection
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useYamlhook from './hooks/useYamlhook.js';
import loadYamlData from './hooks/loadYamlData.js';
import downloadExcel from './utils/downloadExcel.js';
import analyzeJsonData from './utils/analyzeJsonData.js';
import extractValuesFromJson from './utils/extractValuesFromJson.js';
import Layout from './components/Layout.js';
import './index.css';
import store, { StoreSelectServices, StoreSelectService, StoreAllGrp } from './store.js';
import axios from 'axios';

const App = () => {
  const dataForExcel = useYamlhook('/alarmConfig.yaml');
  const [yamlSections, setYamlSections] = useState({
    parameters: {},
    mappings: {},
    resources: {},
    outputs: {},
    subValuesArray: [] // subValuesArrayを追加
  });

  // layoutDataを状態として定義
  const [layoutData, setLayoutData] = useState({ formattedKeyPathSegments: {}, valuesOnlyArray: [], subValuesArray: [] });
  const selectedService = useSelector(state => state.SelectService);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadYamlData('/cwCFnTemp.yaml');
        setYamlSections(data);
      } catch (error) {
        console.error("YAMLデータの読み込みに失敗しました:", error);
      }
    };
    fetchData();
  }, []);

  //サービス一覧と初期サービス登録
  useEffect(() => {
    //リソース句に最低でも一つでもリソースがあること
    if (yamlSections.resourcesGrp) {
      store.dispatch(StoreAllGrp(yamlSections));
      //表示サービス
      let selectedService = store.getState().SelectService;
      //storeにサービスがない場合、Yamlの一番上のサービス指定
      if (!selectedService) {
        selectedService = yamlSections.resourcesGrp[0].values[0].subValue;
        store.dispatch(StoreSelectService(selectedService));
      }
      //storeにサービス一覧登録
      store.dispatch(StoreSelectServices(yamlSections.subValuesArray));
    }
  }, [yamlSections, selectedService]);

  // Storeの状態を取得する関数を定義
  const isStoreReady = () => {
    const state = store.getState().StoreAllGrp;
    return state && state.resourcesGrp && state.resourcesGrp.length > 0;
  };

  // ダウンロードボタンが押されたときの処理
  const handleDownload = () => {
    downloadExcel(dataForExcel, 'AlarmConfig.xlsx');
  };

  // 条件に基づいてLayoutコンポーネントをレンダリング
  return (
    <div>
      {isStoreReady() ? (
        <Layout/>
      ) : (
        <div>データをロード中...</div>
      )}
    </div>
  );
};

export default App;