import React, { useState, useEffect } from 'react';

// Tableコンポーネントは、整形されたKey Pathセグメントを表示するためのものです。
const Table = ({ formattedKeyPathSegments, valuesOnlyArray }) => {
  // columnCountsステートは、セルの結合情報を保持します。
  const [columnCounts, setColumnCounts] = useState({});

  // formattedKeyPathSegmentsの変更に応じてセルの結合情報を更新します。
  useEffect(() => {
    const rowSpanMap = calculateRowSpan(formattedKeyPathSegments);
    const dplSpanMap = calculateDplRowspan(formattedKeyPathSegments);
    setColumnCounts({ ...rowSpanMap, ...dplSpanMap });
  }, [formattedKeyPathSegments]);

  // セルの内容を処理し、表示用のspan要素を生成します。
  const renderCellContent = (cell, cellIndex, isHighlighted) => {
    const cellClass = cell === '' ? 'empty-cell' : '';
    const columnClass = `column-${cellIndex}`;
    const highlightClass = isHighlighted ? 'highlighted-cell' : '';
    const cellContent = cell === '' ? 'null' : cell;

    return (
      <span className={`${cellClass} ${columnClass} ${highlightClass}`}>
        {cellContent}
      </span>
    );
  };

  // 空白セルの下にある非空セルのrowSpanを計算します。//Rowのcol命名逆だこれ・・・縦の空白セルチェック
  const calculateRowSpan = (segments) => {
    const blankBelowCells = {};
    const columnEmptyCounts = {};

    segments.forEach((row, rowIndex) => {
      const nextRow = segments[rowIndex + 1] || [];
      row.forEach((cell, cellIndex) => {
        if (cell === '') {
          columnEmptyCounts[cellIndex] = (columnEmptyCounts[cellIndex] || 0) + 1;
        } else if (nextRow[cellIndex] === '') {
          blankBelowCells[cellIndex] = [...(blankBelowCells[cellIndex] || []), rowIndex];
        }
      });
    });

    return { columnEmptyCounts, blankBelowCells };
  };

  // 同じ内容を持つセルのcolSpanを計算します。//Rowのcol命名逆だこれ・・・ 横の重複チェック
  const calculateDplRowspan = (segments) => {
    const dplRowCell = {};
    const dplCellCounts = {};

    segments.forEach((row, rowIndex) => {
      const contentMap = {};
      row.forEach((cell, cellIndex) => {
        if (cell !== '') {
          contentMap[cell] = [...(contentMap[cell] || []), cellIndex];
        }
      });

      Object.entries(contentMap).forEach(([content, indices]) => {
        if (indices.length > 1) {
          dplRowCell[rowIndex] = [...(dplRowCell[rowIndex] || []), indices[0]];
          dplCellCounts[rowIndex] = { ...(dplCellCounts[rowIndex] || {}), [indices[0]]: indices.length };
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
      {/* <div>Key Path Segments:</div> */}
      <table>
        <thead>
          <tr>
            {formattedKeyPathSegments[0]?.map((_, index) => (
              <th key={index} className={`column-${index}`}>Column {index + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {formattedKeyPathSegments.map((row, rowIndex) => {
            let colSpanIndex = null;
            return (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => {
                  if (colSpanIndex !== null && cellIndex < colSpanIndex) {
                    return null;
                  }

                  // 同じ内容のセルが複数あるかどうかをチェックします
                  const isDuplicated = columnCounts.dplRowCell?.[rowIndex]?.includes(cellIndex) ?? false;
                                    // 複数ある場合のセルの数を取得します
                  const duplicationCount = columnCounts.dplCellCounts[rowIndex]?.[cellIndex] ?? false;
                  // 空白セルの下にある非空セルかどうかをチェックします
                  const isHighlighted = columnCounts.blankBelowCells[cellIndex]?.includes(rowIndex) ?? false;
                  // 複数あるセルの場合、colSpanを設定します //これも命名逆
                  const colSpan = isDuplicated ? duplicationCount : undefined;
                  // 空白セルの下にある非空セルの場合、rowSpanを設定します  //これも命名逆
                  const rowSpan = isHighlighted ? columnCounts.columnEmptyCounts[cellIndex] + 1 : undefined;
                  // 複数あるセルの場合、次のセルのインデックスを更新します
                  colSpanIndex = isDuplicated ? cellIndex + duplicationCount : colSpanIndex;

                  return cell === '' ? null : (
                    <td key={cellIndex} className={`column-${cellIndex}`} {...(colSpan && { colSpan })} {...(rowSpan && { rowSpan })}>
                      {renderCellContent(cell, cellIndex, isHighlighted)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        <tr>
          {valuesOnlyArray.map((value, valueIndex) => (
            <td key={valueIndex} className="data-value">{value.toString()}</td>
          ))}
        </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
