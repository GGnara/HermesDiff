/**
 * src/App.js
 */
// Start of Selection
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useYamlhook from './hooks/useYamlhook.js';
import loadYamlData from './utils/loadYamlData.js';
import downloadExcel from './utils/downloadExcel.js';
import Layout from './components/Layout.js';
import MainMenu from './components/MainMenu/MainMenu.js';
import './index.css';
import store, { StoreSelectServices, StoreSelectService, StoreAllGrp, StoreStackName } from './store.js';

const App = () => {
  const dataForExcel = useYamlhook('/alarmConfig.yaml');
  const [yamlSections, setYamlSections] = useState({
    parameters: {},
    mappings: {},
    resources: {},
    outputs: {},
    subValuesArray: []
  });

  const selectedService = useSelector(state => state.SelectService);
  const selectedCFn = useSelector(state => state.SelectCFn);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const yamlFilePath = '/cwCFnTemp.yaml';
        const data = await loadYamlData(yamlFilePath);
        const fileNameWithoutExtension = yamlFilePath.split('/').pop().split('.')[0];
        store.dispatch(StoreStackName(fileNameWithoutExtension));
        setYamlSections(data);
      } catch (error) {
        console.error("YAMLデータの読み込みに失敗しました:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (yamlSections.resourcesGrp) {
      store.dispatch(StoreAllGrp(yamlSections));
      let selectedService = store.getState().SelectService;
      if (!selectedService) {
        selectedService = yamlSections.resourcesGrp[0].values[0].subValue;
        store.dispatch(StoreSelectService(selectedService));
      }
      store.dispatch(StoreSelectServices(yamlSections.subValuesArray));
    }
  }, [yamlSections, selectedService]);

  const isStoreReady = () => {
    const state = store.getState().StoreAllGrp;
    return state && state.resourcesGrp && state.resourcesGrp.length > 0;
  };

  const handleDownload = () => {
    downloadExcel(dataForExcel, 'AlarmConfig.xlsx');
  };

  return (
    <div>
      {selectedCFn ? (
        isStoreReady() ? (
          <Layout />
        ) : (
          <div>データをロード中...</div>
        )
      ) : (
        <MainMenu />
      )}
    </div>
  );
};

export default App;