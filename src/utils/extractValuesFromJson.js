/**
 * JSONデータから値を抽出する関数
 * @param {Object|Array} data - JSONデータ
 * @returns {Array} - 抽出された値の配列
 */
function extractValuesFromJson(data) {
  const values =[]; 
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
      if (typeof val === 'object' && val !== null && Object.keys(val).length > 0) {
        value = value.concat(explore(val)); // 再帰的に探索し、結果を結合
      } else {
        value.push(val === "" || (Array.isArray(val) && val.length === 0) ? "" : val); // 値を記録
      }
    });
  }
  return value;
}
export default extractValuesFromJson;

