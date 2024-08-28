import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import store, { StoreStackName, StoreSelectCFn } from '../../store.js';
import './MainMenu.css';

const MainMenu = () => {
  const [cfnList, setCfnList] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    // ここでCFnのリストを取得する処理を実装
    // 例: APIからデータを取得するなど
    const dummyCfnList = ['CFn1', 'CFn2', 'CFn3'];
    setCfnList(dummyCfnList);
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