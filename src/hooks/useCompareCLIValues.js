/**
 * useCompareCLIValues - StoreCLIValueからStoreSelectServiceに保存されたサービスに関連する値をフィルタリングするカスタムフック
 * @returns {Object} - フィルタリングされた結果を含むオブジェクト
 */
import { useSelector } from 'react-redux';
import React from 'react';

const useCompareCLIValues = () => {
    // ReduxのストアからCLIの値を取得
    const cliValue = useSelector(state => state.StoreCLIValue);
    // Reduxのストアから選択されたサービスを取得
    const selectedService = useSelector(state => state.SelectService);
    // ReduxのストアからCLIの差分キーを取得
    const cliDiffKey = useSelector(state => state.CLIDiffKey);

    const filteredValues = {};

    // filterObjects関数は、オブジェクトを再帰的に探索し、特定の条件に一致する値をフィルタリングします。
    const filterObjects = (obj, path = '') => {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const newPath = path ? `${path}.${key}` : key;
                // 配列の3番目の要素(AWSサービス名)が選択されたサービスと一致する場合、filteredValuesに追加
                if (Array.isArray(obj[key]) && obj[key][2] === selectedService) {
                    filteredValues[newPath] = obj[key];
                }
            }
        }
    };

    //CLI取得があった場合
    if (cliValue && selectedService) {
        filterObjects(cliValue);
            // CLIの値をコンソールに出力
        console.log('CLI Value:', cliValue);
        console.log(JSON.stringify({ cliDiffKey: cliDiffKey }));
        console.log('Filtered CLI Values:', filteredValues);
    }
    return filteredValues;
};

export default useCompareCLIValues;
