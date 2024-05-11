// App.js
import React, { useState, useEffect } from 'react';
import useYamlhook from './hooks/useYamlhook';
import downloadExcel from './utils/downloadExcel';
import analyzeJsonData from './utils/analyzeJsonData';
import Layout from './components/Layout';

import './index.css';

const App = () => {
  const dataForExcel = useYamlhook('/alarmConfig.yaml');
  const formattedKeyPathSegments = analyzeJsonData(dataForExcel);

  // ダウンロードボタンが押されたときの処理
  const handleDownload = () => {
    downloadExcel(dataForExcel, 'AlarmConfig.xlsx');
  };


  return (
    <Layout formattedKeyPathSegments={formattedKeyPathSegments} />
  );
};



export default App;

