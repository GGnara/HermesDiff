import React from 'react';
import './Sidebar.css';
import store, { setSelectService } from '../store.js';

const Sidebar = ({ subValuesArray }) => {
  const listServices = store.getState().SelectServices;

  const handleClick = (item) => {
    store.dispatch(setSelectService(item));
  };

  return (
    <div className="sidebar">
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