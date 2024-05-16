import React from 'react';

const Sidebar = ({ subValuesArray }) => {
  return (
    <div className="sidebar">
      {/* サイドバーの内容 */}
      {subValuesArray.map((item, index) => (
        <div key={index} className="sidebar-item">{item}</div>
      ))}
      {/* 他の項目 */}
    </div>
  );
};

export default Sidebar;