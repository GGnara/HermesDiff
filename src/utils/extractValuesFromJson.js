/**
 * JSONデータから値を抽出する関数
 * @param {Object|Array} data - JSONデータ
 * @returns {Array} - 抽出された値の配列
 */
function extractValuesFromJson(data) {
  const values = [];
  data.forEach((item, index) => {
    values[index] = explore(item.values[1].subValue); // 各アイテムを探索して値を収集
  });
  return values;
}

// JSONデータを探索し、値のみを記録する関数
function explore(data) {
  let resVal = [];
  if (typeof data === 'object' && data !== null) { // データがオブジェクトかどうかをチェック
    Object.values(data).forEach((val) => {
      if (Array.isArray(val)) {
        // 配列の場合、要素がすべて単純な値かどうかをチェック
        const allSimpleValues = val.every(item => typeof item !== 'object' || item === null);
        if (allSimpleValues) {
          // 要素がすべて単純な値の場合、改行で連結
          resVal.push(val.join('\n'));
        } else {
          // 要素にオブジェクトが含まれている場合、個別に処理
          const objectCount = val.filter(item => typeof item === 'object' && item !== null).length;
          if (objectCount >= 2) {
            // 配列の中身がオブジェクトで、2個以上のオブジェクトが含まれている場合
            const values = [];
            val.forEach(item => {
              if (typeof item === 'object' && item !== null) {
                values.push(...Object.values(item)); // オブジェクトの値を収集
              }
            });
            const keys = [];
            const vals = [];
            //key,valueのそれぞれを分ける
            for (let i = 0; i < values.length; i += 2) {
              keys.push(values[i]);
              vals.push(values[i + 1]);
            }
            resVal.push(keys.join('\n'));
            resVal.push(vals.join('\n'));
          } else {
            resVal = resVal.concat(explore(val)); // 再帰的に探索し、結果を結合
          }
        }
      } else if (typeof val === 'object' && val !== null && Object.keys(val).length > 0) {
        resVal = resVal.concat(explore(val)); // 再帰的に探索し、結果を結合
      } else {
        resVal.push(val === "" ? "" : val); // 値を記録
      }
    });
  } else {
    resVal.push(data === "" ? "" : data); // 値を記録
  }
  // 改行で連結した値に限り、Reactで改行されるように変更
  resVal = resVal.map(val => {
    if (typeof val === 'string' && val.includes('\n')) {
      const sortedValues = val.split('\n').sort((a, b) => a.localeCompare(b));
      return sortedValues.join('\n'); // <br/>から\nに変更
    }
    return val;
  });
  return resVal;
}

export default extractValuesFromJson;