// App.js
import React, { useState, useEffect } from 'react';
import useYamlhook from './hooks/useYamlhook';
import loadYamlData from './hooks/loadYamlData'; 
import downloadExcel from './utils/downloadExcel';
import analyzeJsonData from './utils/analyzeJsonData';
import Layout from './components/Layout';


import './index.css';

const App = () => {
  const dataForExcel = useYamlhook('/alarmConfig.yaml');

  //console.log(dataForExcel)


  const [yamlSections, setYamlSections] = useState({
    parameters: {},
    mappings: {},
    resources: {},
    outputs: {}
  });

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

  // ここでyamlSectionsを使用する
  //console.log(yamlSections.resources);

  const { formattedKeyPathSegments, valuesOnlyArray } = analyzeJsonData(yamlSections.resourcesGrp[1]);
  //console.log(valuesOnlyArray)

  // ダウンロードボタンが押されたときの処理
  const handleDownload = () => {
    downloadExcel(dataForExcel, 'AlarmConfig.xlsx');
  };


  return (
    <Layout formattedKeyPathSegments={formattedKeyPathSegments} valuesOnlyArray={valuesOnlyArray} />
  );
};



export default App;

