import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useYamlhook from './hooks/useYamlhook.js';
import loadYamlData from './hooks/loadYamlData.js';
import downloadExcel from './utils/downloadExcel.js';
import analyzeJsonData from './utils/analyzeJsonData.js';
import extractValuesFromJson from './utils/extractValuesFromJson.js';
import Layout from './components/Layout.js';
import './index.css';
import store, { StoreSelectServices, StoreSelectService,StoreAllGrp } from './store.js';
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

  useEffect(() => {
    //リソース句に最低でも一つでもリソースがあること
    if (yamlSections.resourcesGrp) {
      store.dispatch(StoreAllGrp(yamlSections));
      //Yaml解析を行う

      //表示サービス
      let selectedService = store.getState().SelectService;
      //storeにサービスがない場合、Yamlの一番上のサービス指定
      if (!selectedService) {
        selectedService = yamlSections.resourcesGrp[0].values[0].subValue;
        store.dispatch(StoreSelectService(selectedService));
      }
      //対象サービスのみを元Yaml一覧から取得
      const filteredResourcesGrp = yamlSections.resourcesGrp.filter(resource =>
        resource.values && resource.values[0] && resource.values[0].subValue === selectedService
      );
      
      
      //キーを取得
      const { formattedKeyPathSegments } = analyzeJsonData(filteredResourcesGrp[0].values[1].subValue);
      //値を取得
      const values = extractValuesFromJson(filteredResourcesGrp)
      //値を設定
      const valuesOnlyArray = values
      //storeにサービス一覧登録
      store.dispatch(StoreSelectServices(yamlSections.subValuesArray));
      setLayoutData({ formattedKeyPathSegments, valuesOnlyArray });

    console.log('Store:', store.getState());
    }
  }, [yamlSections, selectedService]);


  // ダウンロードボタンが押されたときの処理
  const handleDownload = () => {
    downloadExcel(dataForExcel, 'AlarmConfig.xlsx');
  };



  // 条件に基づいてLayoutコンポーネントをレンダリング
  return (
    <div>
      {layoutData.valuesOnlyArray.length > 0 ? (
        <Layout/>
      ) : (
        <div>データをロード中...</div>
      )}
    </div>
  );
};

export default App;