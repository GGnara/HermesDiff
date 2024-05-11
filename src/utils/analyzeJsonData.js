function analyzeJsonData(data) {
  const keyDepths = {}; // キーとその深さを保持するオブジェクト
  let globalDepth = 0; // グローバルな深さを追跡

  // JSONデータを探索し、キーの深さを記録する関数
  function explore(data, currentDepth = 0, parentPath = '') {
    if (typeof data === 'object' && data !== null) { // データがオブジェクトかどうかをチェック
      Object.keys(data).forEach((key) => {
        const currentPath = parentPath ? `${parentPath}.${key}` : key; // 現在のキーパスを構築
        if (!Array.isArray(data)) { // 配列でない場合のみキーを記録
          keyDepths[currentPath] = { depth: currentDepth, value: data[key] }; // 深さと値を記録
        }
        const nextDepth = Array.isArray(data) ? currentDepth : currentDepth + 1; // 次の深さを計算
        explore(data[key], nextDepth, Array.isArray(data) ? parentPath : currentPath); // 再帰的に探索
      });
    }
  }

  explore(data, globalDepth); // データ探索を開始

  // keyDepths の各キーと深さをコンソールに表示し、重複したパスがあれば削除する
  Object.keys(keyDepths).forEach(key => {
    const matchingKey = key.split('.').slice(0, -1).join('.');
    if (keyDepths.hasOwnProperty(matchingKey)) {
      delete keyDepths[matchingKey];
    }
  });


  // キーのパスを配列に変換する関数
  function splitKeyDepthsIntoArray() {
    return Object.keys(keyDepths).map(path => path.split('.')); // パスを'.'で分割して配列にする
  }

  // splitKeyDepthsIntoArray関数を使用してキーパスのセグメントを配列として取得
  const keyPathSegments = splitKeyDepthsIntoArray();

  // テーブルの各行がキーのパスに対応し、各列がパスの特定のセグメントに対応する二次元配列が得る
  function formatKeyPathSegmentsForTable() {
    const maxColumnLength = Math.max(...keyPathSegments.map(segment => segment.length)); // 最大の列数を計算
    return Array.from({ length: maxColumnLength }, (_, i) =>
      keyPathSegments.map(segment => segment[i] || '') // 各行に対してセグメントを配置
    );
  }

  const formattedKeyPathSegments = formatKeyPathSegmentsForTable(); // フォーマットされたキーパスセグメントを取得


  //ここからはValueを取得
  // 値だけを含む配列を返す関数
  function extractValues() {
    return Object.values(keyDepths).flatMap(entry => 
      Array.isArray(entry.value) && entry.value.length === 0 ? [""] : Array.isArray(entry.value) ? entry.value : [entry.value]
    );
  }
  const valuesOnlyArray = extractValues();

  return {
    formattedKeyPathSegments, // キーのパスと値を含む二次元配列
    valuesOnlyArray // 値のみを含む配列
  };
}


export default analyzeJsonData;
