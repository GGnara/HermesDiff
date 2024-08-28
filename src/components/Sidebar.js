import React from 'react';
import './Sidebar.css';
import store, { StoreSelectService, StoreSelectCFn } from '../store.js';
import { useDispatch } from 'react-redux';

const Sidebar = ({ subValuesArray }) => {
  const listServices = store.getState().SelectServices;
  const dispatch = useDispatch();

  const handleClick = (item) => {
    store.dispatch(StoreSelectService(item));
  };

  const handleBackToMainMenu = () => {
    dispatch(StoreSelectCFn(false));
  };

  return (
    <div className="sidebar">
      <button 
        className="back-to-main-menu" 
        onClick={handleBackToMainMenu}
      >
        メインメニューに戻る
      </button>
      {/* サイドバーの内容 */}
      {listServices.map((item, index) => (
        <div 
          key={index} 
          className="sidebar-item" 
          onClick={() => handleClick(item)}
        >
          {item.replace('AWS::', '')}
        </div>
      ))}
      {/* 他の項目 */}
    </div>
  );
};

export default Sidebar;