import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; 
import useYamlhook from './hooks/useYamlhook.js'; 
import loadYamlData from './hooks/loadYamlData.js'; 
import downloadExcel from './utils/downloadExcel.js'; 
import analyzeJsonData from './utils/analyzeJsonData.js';
import extractValuesFromJson from './utils/extractValuesFromJson.js'; 
import Layout from './components/Layout.js';
import './index.css';
import store, { addItem, removeItem, setSelectServices ,setSelectService } from './store.js';
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
    if (yamlSections.resourcesGrp && yamlSections.resourcesGrp) {
      //Yaml解析を行う
      
      //表示サービス
      let selectedService = store.getState().SelectService;
      //storeにサービスがない場合、Yamlの一番上のサービス指定
      if (!selectedService) {
        selectedService = yamlSections.resourcesGrp[0].values[0].subValue;
        store.dispatch(setSelectService(selectedService));
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
      store.dispatch(setSelectServices(yamlSections.subValuesArray));
      setLayoutData({ formattedKeyPathSegments, valuesOnlyArray});
    }
  }, [yamlSections,selectedService]);

  //CLI実行
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:53906/execute-aws-cli');
        console.log(response.data);
      } catch (error) {
        console.error('エラーが発生しました:', error);
      }
    };
    fetchData();
  }, []);


  // ダウンロードボタンが押されたときの処理
  const handleDownload = () => {
    downloadExcel(dataForExcel, 'AlarmConfig.xlsx');
  };



  // 条件に基づいてLayoutコンポーネントをレンダリング
  return (
    <div>
      {layoutData.valuesOnlyArray.length > 0 ? (
        <Layout 
          formattedKeyPathSegments={layoutData.formattedKeyPathSegments} 
          valuesOnlyArray={layoutData.valuesOnlyArray} 
          subValuesArray={layoutData.subValuesArray} // subValuesArrayを渡す
        />
      ) : (
        <div>データをロード中...</div>
      )}
    </div>
  );
};

export default App;