import React from 'react';
import './Sidebar.css';
const Sidebar = ({ subValuesArray }) => {
  const handleClick = (item) => {
    console.log(item);
  };

  return (
    <div className="sidebar">
      {/* サイドバーの内容 */}
      {subValuesArray.map((item, index) => (
        <div 
          key={index} 
          className="sidebar-item" 
          onClick={() => handleClick(item)}
        >
          {item}
        </div>
      ))}
      {/* 他の項目 */}
    </div>
  );
};

export default Sidebar;