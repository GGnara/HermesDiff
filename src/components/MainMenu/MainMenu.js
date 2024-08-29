import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import store, { StoreStackName, StoreSelectCFn } from '../../store.js';
import './MainMenu.css';

const MainMenu = () => {
  const [cfnList, setCfnList] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    // ここでCFnのリストを取得する処理を実装
    const fetchCfnList = async () => {
      try {
        const response = await fetch('http://localhost:53906/list-cfn-yaml');
        if (response.ok) {
          const yamlFiles = await response.json();
          setCfnList(yamlFiles);
        } else {
          console.error('CFnリストの取得に失敗しました');
        }
      } catch (error) {
        console.error('エラーが発生しました:', error);
      }
    };

    fetchCfnList();
  }, []);

  const handleCfnSelect = (cfn) => {
    dispatch(StoreStackName(cfn));
    dispatch(StoreSelectCFn(true));
  };

  return (
    <div className="main-menu">
      <h1>CFn選択メニュー</h1>
      <ul>
        {cfnList.map((cfn, index) => (
          <li key={index} onClick={() => handleCfnSelect(cfn)}>
            {cfn}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MainMenu;