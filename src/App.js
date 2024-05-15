import React, { useState, useEffect } from 'react';
import useYamlhook from './hooks/useYamlhook.js'; // 拡張子を追加
import loadYamlData from './hooks/loadYamlData.js'; // 拡張子を追加
import downloadExcel from './utils/downloadExcel.js'; // 拡張子を追加
import analyzeJsonData from './utils/analyzeJsonData.js'; // 拡張子を追加
import extractValuesFromJson from './utils/extractValuesFromJson.js'; // 拡張子を追加
import Layout from './components/Layout.js'; // 拡張子を追加
import './index.css';

const App = () => {
  const dataForExcel = useYamlhook('/alarmConfig.yaml');
  const [yamlSections, setYamlSections] = useState({
    parameters: {},
    mappings: {},
    resources: {},
    outputs: {}
  });

  // layoutDataを状態として定義
  const [layoutData, setLayoutData] = useState({ formattedKeyPathSegments: {}, valuesOnlyArray: [] });

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
      //キーを取得
      const { formattedKeyPathSegments } = analyzeJsonData(yamlSections.resourcesGrp[0].values[1].subValue);
      //値を取得
      const values = extractValuesFromJson(yamlSections.resourcesGrp)
      //値を設定
      const valuesOnlyArray = values
      setLayoutData({ formattedKeyPathSegments, valuesOnlyArray });
    }
  }, [yamlSections]);

  // ダウンロードボタンが押されたときの処理
  const handleDownload = () => {
    downloadExcel(dataForExcel, 'AlarmConfig.xlsx');
  };

  // 条件に基づいてLayoutコンポーネントをレンダリング
  return (
    <div>
      {layoutData.valuesOnlyArray.length > 0 ? (
        <Layout formattedKeyPathSegments={layoutData.formattedKeyPathSegments} valuesOnlyArray={layoutData.valuesOnlyArray} />
      ) : (
        <div>データをロード中...</div>
      )}
    </div>
  );
};

export default App;