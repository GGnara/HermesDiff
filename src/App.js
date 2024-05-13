import React, { useState, useEffect } from 'react';
import useYamlhook from './hooks/useYamlhook';
import loadYamlData from './hooks/loadYamlData';
import downloadExcel from './utils/downloadExcel';
import analyzeJsonData from './utils/analyzeJsonData';
import Layout from './components/Layout';

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
    if (yamlSections.resourcesGrp && yamlSections.resourcesGrp[0]) {
        console.log(yamlSections.resourcesGrp)
        const { formattedKeyPathSegments, valuesOnlyArray } = analyzeJsonData(yamlSections.resourcesGrp[0]);
        console.log(formattedKeyPathSegments)
        // layoutDataの状態を更新
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