import React from 'react';
import Table from './Table.js'; // 拡張子を追加
import Menu from './Menu.js'; // 拡張子を追加
import Header from './Header.js'; // 拡張子を追加
import Footer from './Footer.js'; // 拡張子を追加
import Sidebar from './Sidebar.js'; // 拡張子を追加
import './Layout.css'; // スタイルシートをインポート

const Layout = ({ formattedKeyPathSegments, valuesOnlyArray }) => {
  return (
    <div className="layout">
      <Header />
      <div className="content-area">
        <Sidebar /> {/* サイドバーを追加 */}
        <main>
          <Menu />
          <Table formattedKeyPathSegments={formattedKeyPathSegments} valuesOnlyArray={valuesOnlyArray} />
        </main>
      </div>
      <Footer />
    </div>
  );
};
export default Layout;