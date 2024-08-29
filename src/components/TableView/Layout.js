import React, { useState } from 'react';
import Menu from './Menu.js';
import Table from './Table.js';
import './Layout.css';

const Layout = () => {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);

  const handleMenuCollapse = (collapsed) => {
    setIsMenuCollapsed(collapsed);
  };

  return (
    <div className="layout">
      <Menu onCollapse={handleMenuCollapse} />
      <main className={`main-content ${isMenuCollapsed ? 'menu-collapsed' : ''}`}>
        <Table />
      </main>
    </div>
  );
};

export default Layout;