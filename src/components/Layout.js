import React from 'react';
import Table from './Table';
import Menu from './Menu';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar'; // サイドバーをインポート
import './Layout.css'; // スタイルシートをインポート

const Layout = ({ formattedKeyPathSegments }) => {
  return (
    <div className="layout">
      <Header />
      <div className="content-area">
        <Sidebar /> {/* サイドバーを追加 */}
        <main>
          <Menu />
          <Table formattedKeyPathSegments={formattedKeyPathSegments} />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;