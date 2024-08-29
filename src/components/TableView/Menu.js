import './Menu.css'; // Menuのスタイルシートをインポート
import { fetchAwsStackDetails, fetchAwsData } from '../../utils/api.js';
import store, { StoreCLIValue, StoreTaggleCLIValuesFlg, StoreSelectService, StoreSelectCFn } from '../../store.js';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useCompareCLIValues from '../../hooks/useCompareCLIValues.js';

const Menu = ({ onCollapse }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const listServices = useSelector(state => state.SelectServices);
  const dispatch = useDispatch();

  const toggleMenu = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onCollapse(newCollapsedState);
  };

  const handleClick = async () => {
    setIsModalOpen(true);
    setModalContent('処理を開始しています...');
    store.dispatch(StoreTaggleCLIValuesFlg());
    try {
      const awsAccessKeyId = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
      const awsSecretAccessKey = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
      const awsRegion = process.env.REACT_APP_AWS_REGION;
      if (!awsAccessKeyId || !awsSecretAccessKey || !awsRegion) {
        throw new Error('AWS環境変数が設定されていません');
      }
      setModalContent('スタックの詳細を取得中...');
      const stackDetails = await fetchAwsStackDetails(awsAccessKeyId, awsSecretAccessKey, awsRegion);
      console.log('AWS Stack Details:', stackDetails);
      
      setModalContent('CLIコマンドを実行中...');
      const stackName = store.getState().StackName; 
      const cliCommand = `cloudformation describe-stack-resource-drifts --stack-name ${stackName} --stack-resource-drift-status-filters IN_SYNC MODIFIED DELETED NOT_CHECKED --output json`;
      const data = await fetchAwsData(awsAccessKeyId, awsSecretAccessKey, awsRegion, cliCommand);
      
      store.dispatch(StoreCLIValue(data));
      console.log('ストアのCLIValue:', store.getState().StoreCLIValue);
      setModalContent('処理が完了しました。');
    } catch (error) {
      console.error('AWS CLIデータの取得に失敗しました:', error);
      setModalContent('エラーが発生しました。詳細はコンソールを確認してください。');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent('');
  };

  const handleServiceClick = (item) => {
    dispatch(StoreSelectService(item));
  };

  const handleBackToMainMenu = () => {
    dispatch(StoreSelectCFn(false));
  };

  return (
    <nav className={`menu ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="toggle-button" onClick={toggleMenu}>
        {isCollapsed ? '≡' : '<'}
      </button>
      <div className="menu-content">
        <h2>メニュー</h2>
        <button onClick={handleClick}>クリック</button>

        {listServices.map((item, index) => (
          <div 
            key={index} 
            className="sidebar-item" 
            onClick={() => handleServiceClick(item)}
          >
            {item.replace('AWS::', '')}
          </div>
        ))}
        <button className="back-to-main-menu" onClick={handleBackToMainMenu}>
          メインメニューに戻る
        </button>
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <p>{modalContent}</p>
            <button onClick={closeModal}>閉じる</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Menu;