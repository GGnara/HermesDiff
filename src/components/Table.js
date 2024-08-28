import React, { useState, useEffect, useRef } from 'react';
import store, { StoreSelectServices, StoreSelectService, StoreAllGrp, StoreLogicalID ,StoreCLIDiffKey} from '../store.js';
import analyzeJsonData from '../utils/analyzeJsonData.js';
import extractValuesFromJson from '../utils/extractValuesFromJson.js';
import './Table.css';

// Tableコンポーネントは、整形されたKey Pathセグメントを表示するためのものです。
const Table = () => {
  // columnCountsステートは、セルの結合情報を保持します。
  const [columnCounts, setColumnCounts] = useState({});
  const [valuesOnlyArray, setValuesOnlyArray] = useState([]);
  const [formattedKeyPathSegments, setFormattedKeyPathSegments] = useState([]);
  const [logicalIds, setLogicalIds] = useState([]);
  const [TaggleCLIValuesFlg, setTaggleCLIValuesFlg] = useState(false);
  const [mergedObject, setMergedObject] = useState({});
  const prevProcessingFlag = useRef(false);

  useEffect(() => {
    const handleStoreChange = () => {
      // ストアの現在の状態を取得
      const state = store.getState();

      // processingFlag状態に応じてレンダリングを切り替え
      if (state.processingFlag !== prevProcessingFlag.current) {
        if (state.processingFlag) {
          // 処理中のレンダリング
          console.log("CLI処理中");
          setTaggleCLIValuesFlg(true);
        } else {
          // 通常のレンダリング
          console.log("CLI処理なし");
          setTaggleCLIValuesFlg(false);
        }
        prevProcessingFlag.current = state.processingFlag;
      }
    };

    // ストアの変更を監視するリスナーを追加
    const unsubscribe = store.subscribe(handleStoreChange);

    // クリーンアップ関数を返して、コンポーネントのアンマウント時にリスナーを解除
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleStoreAllGrpChange = () => {
      const AllGrp = store.getState().StoreAllGrp;
      handleAllGrpChange(AllGrp);
    };

    // ストアの変更を監視するリスナーを追加
    const unsubscribe = store.subscribe(handleStoreAllGrpChange);

    // クリーンアップ関数を返して、コンポーネントのアンマウント時にリスナーを解除
    return () => {
      unsubscribe();
    };
  }, [logicalIds]);

  // CLI比較用のkeyをstoreに格納
  useEffect(() => {
    if (mergedObject !== "") {
      setTimeout(() => {
        store.dispatch(StoreCLIDiffKey(mergedObject));
      }, 0);
    }
  }, [mergedObject]);

  // 論理IDをstoreに格納
  useEffect(() => {
    if (logicalIds.length > 0) {
      setTimeout(() => {
        store.dispatch(StoreLogicalID(logicalIds));
      }, 0);
    }
  }, [logicalIds]);

  const handleAllGrpChange = (AllGrp) => {
    if (AllGrp) {
      // 必要に応じて他の処理を追加
      // 表示サービス
      let selectedService = store.getState().SelectService;

      // 対象サービスのみを元Yaml一覧から取得
      const filteredResourcesGrp = AllGrp.resourcesGrp.filter(resource =>
        resource.values && resource.values[0] && resource.values[0].subValue === selectedService
      );

      // 論理IDを取得
      const newLogicalIds = AllGrp.resourcesGrp
        .filter(resource => resource.values && resource.values[0] && resource.values[0].subValue === selectedService)
        .map(resource => resource.key);

      // 論理IDが変更された場合のみ状態を更新
      if (JSON.stringify(newLogicalIds) !== JSON.stringify(logicalIds)) {
        setLogicalIds(newLogicalIds);
      }

      // キーを取得
      const { formattedKeyPathSegments } = analyzeJsonData(filteredResourcesGrp[0].values[1].subValue);
      const newMergedObject = mergeMultipleArrays(...formattedKeyPathSegments);

      // mergedObjectが変更された場合のみ状態を更新
      if (JSON.stringify(newMergedObject) !== JSON.stringify(mergedObject)) {
        setMergedObject(newMergedObject);
      }

      // 値を取得
      const values = extractValuesFromJson(filteredResourcesGrp);
      // 値を設定
      setValuesOnlyArray(values);

      // colとrows生成
      setFormattedKeyPathSegments(formattedKeyPathSegments);
      const rowSpanMap = calculateRowSpan(formattedKeyPathSegments);
      const dplSpanMap = calculateDplRowspan(formattedKeyPathSegments);
      setColumnCounts({ ...rowSpanMap, ...dplSpanMap });
    }
    //console.log(store.getState());
  };

/**
 * 複数の配列を合体し、各配列が前の配列の子要素を表すようにする関数
 * @param {...Array} arrays - 任意の数の配列
 * @returns {Object} - 合体されたオブジェクト 
 */
function mergeMultipleArrays(...arrays) {
  if (arrays.length === 0) return {};

  const result = {};

  arrays[0].forEach((key, index) => {
    let current = result;
    if (arrays.length === 1) {
      current[key] = arrays[0][index];
    } else {
      for (let i = 1; i < arrays.length; i++) {
        const value = arrays[i][index];
        if (i === arrays.length - 1) {
          if (current[key]) {
            if (Array.isArray(current[key])) {
              current[key].push(value);
            } else {
              current[key] = [current[key], value];
            }
          } else {
            current[key] = value;
          }
        } else {
          if (!current[key]) {
            current[key] = {};
          }
          current = current[key];
        }
      }
    }
  });
  return result;
}

  // セルの内容を処理し、表示用のspan要素を生成します。
  const renderCellContent = (cell, cellIndex, isHighlighted) => {
    const cellClass = cell === '' ? 'empty-cell' : '';
    const columnClass = `column-${cellIndex}`;
    const highlightClass = isHighlighted ? 'highlighted-cell' : '';
    const cellContent = cell === '' ? 'null' : cell;

    return (
      <span className={`${cellClass} ${columnClass} ${highlightClass}`} >
        {cellContent}
      </span>
    );
  };

  // 空白セルの下にある非空セルのrowSpanを計算します。
  const calculateRowSpan = (segments) => {
    const blankBelowCells = {}; // 空白セルの下にある非空セルの情報を保持するオブジェクト
    const columnEmptyCounts = {}; // 各列の空白セルの数を保持するオブジェクト

    segments.forEach((row, rowIndex) => {
      const nextRow = segments[rowIndex + 1] || []; // 次の行を取得
      row.forEach((cell, cellIndex) => {
        if (cell === '') {
          columnEmptyCounts[cellIndex] = (columnEmptyCounts[cellIndex] || 0) + 1; // 空白セルの数をカウント
        } else if (nextRow[cellIndex] === '') {
          blankBelowCells[cellIndex] = [...(blankBelowCells[cellIndex] || []), rowIndex]; // 空白セルの下にある非空セルの行インデックスを保持
        }
      });
    });

    return { columnEmptyCounts, blankBelowCells };
  };

  // 同じ内容を持つセルのcolSpanを計算します。
  const calculateDplRowspan = (segments) => {
    const dplRowCell = {}; // 重複セルの情報を保持するオブジェクト
    const dplCellCounts = {}; // 各行の重複セルの数を保持するオブジェクト

    segments.forEach((row, rowIndex) => {
      const contentMap = {}; // セルの内容をキーにして、同じ内容を持つセルのインデックスを保持するオブジェクト
      row.forEach((cell, cellIndex) => {
        if (cell !== '') {
          contentMap[cell] = [...(contentMap[cell] || []), cellIndex]; // セルの内容をキーにして、同じ内容を持つセルのインデックスを保持
        }
      });

      Object.entries(contentMap).forEach(([content, indices]) => {
        if (indices.length > 1) {
          dplRowCell[rowIndex] = [...(dplRowCell[rowIndex] || []), indices[0]]; // 重複セルの行インデックスを保持
          dplCellCounts[rowIndex] = { ...(dplCellCounts[rowIndex] || {}), [indices[0]]: indices.length }; // 重複セルの数を保持
        }
      });
    });

    return { dplRowCell, dplCellCounts };
  };

  // データがない場合は、その旨を表示します。
  if (!formattedKeyPathSegments || formattedKeyPathSegments.length === 0) {
    return <div>データがありません。</div>;
  }

  // テーブルのヘッダーとボディを生成し、表示します。
  return (
    <div>
      <table>
        <thead>
          {/* デバック用カラムナンバー */}
          {/* <tr>
            {formattedKeyPathSegments[0]?.map((_, index) => (
              <th key={index} className={`column-${index}`}>Column {index + 1}</th>
            ))}
          </tr> */}
        </thead>
        <tbody>
          {formattedKeyPathSegments.map((row, rowIndex) => {
            let colSpanIndex = null;
            return (
              <tr key={rowIndex}>
                {rowIndex === 0 && (
                  <td className="logical-id" rowSpan={formattedKeyPathSegments.length}>論理ID</td>
                )}
                {row.map((cell, cellIndex) => {
                  if (colSpanIndex !== null && cellIndex < colSpanIndex) {
                    return null;
                  }
                  // 同じ内容のセルが複数あるかどうかをチェックします
                  const isDuplicated = columnCounts.dplRowCell?.[rowIndex]?.includes(cellIndex) ?? false;
                  // 複数ある場合のセルの数を取得します
                  const duplicationCount = columnCounts.dplCellCounts?.[rowIndex]?.[cellIndex] ?? 1;
                  // 空白セルの下にある非空セルかどうかをチェックします
                  const isHighlighted = columnCounts.blankBelowCells?.[cellIndex]?.includes(rowIndex) ?? false;
                  // 複数あるセルの場合、colSpanを設定します
                  const colSpan = isDuplicated ? duplicationCount : 1;
                  // 空白セルの下にある非空セルの場合、rowSpanを設定します
                  const rowSpan = isHighlighted ? (columnCounts.columnEmptyCounts?.[cellIndex] ?? 0) + 1 : 1;
                  // 数あるセルの場合、次のセルのインデックスを更新します
                  colSpanIndex = isDuplicated ? cellIndex + duplicationCount : colSpanIndex;

                  return cell === '' ? null : (
                    <td key={cellIndex} className={`column-${cellIndex}`} colSpan={colSpan} rowSpan={rowSpan}>
                      {renderCellContent(cell, cellIndex, isHighlighted)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          {valuesOnlyArray.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <tr className={`row-${logicalIds[rowIndex]}`}>
                <td className="logical-id">{logicalIds[rowIndex]}</td>
                {row.map((value, valueIndex) => {
                  //一応改行は検知しておく
                  const cellClass = value.toString().includes('\n') ? 'data-value multi-line' : 'data-value';
                  return (
                    <td key={valueIndex} className={cellClass} >{value.toString()}</td>
                  );
                })}
              </tr>
              {TaggleCLIValuesFlg && (
                <tr className={`row-cli-${logicalIds[rowIndex]}`}>
                  <td className="logical-id"></td>
                  {row.map((_, valueIndex) => (
                    <td key={`cli-${valueIndex}`} className="data-value"></td>
                  ))}
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
