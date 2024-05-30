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
  let value = [];
  if (typeof data === 'object' && data !== null) { // データがオブジェクトかどうかをチェック
    Object.values(data).forEach((val) => {
      if (Array.isArray(val)) {
        // 配列の場合、要素がすべて単純な値かどうかをチェック
        const allSimpleValues = val.every(item => typeof item !== 'object' || item === null);
        if (allSimpleValues) {
          // 要素がすべて単純な値の場合、改行で連結
          value.push(val.join('\n'));
        } else {
          // 要素にオブジェクトが含まれている場合、個別に処理
          value = value.concat(explore(val)); // 再帰的に探索し、結果を結合
        }
      } else if (typeof val === 'object' && val !== null && Object.keys(val).length > 0) {
        value = value.concat(explore(val)); // 再帰的に探索し、結果を結合
      } else {
        value.push(val === "" ? "" : val); // 値を記録
      }
    });
  } else if (Array.isArray(data)) {
    // dataが配列の場合、要素がすべて単純な値かどうかをチェック
    const allSimpleValues = data.every(item => typeof item !== 'object' || item === null);
    if (allSimpleValues) {
      // 要素がすべて単純な値の場合、改行で連結
      value.push(data.join('\n'));
    } else {
      // 要素にオブジェクトが含まれている場合、個別に処理
      value = value.concat(explore(data)); // 再帰的に探索し、結果を結合
    }
  } else {
    value.push(data === "" ? "" : data); // 値を記録
  }
  // 改行で連結した値に限り、Timsortを結合した値に反映する
  value = value.map(val => {
    if (typeof val === 'string' && val.includes('\n')) {
      const sortedValues = val.split('\n').sort((a, b) => a.localeCompare(b));
      return sortedValues.join('\n');
    }
    return val;
  });
  return value;
}
export default extractValuesFromJson;