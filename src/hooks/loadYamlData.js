import yaml from 'js-yaml';

// CloudFormationの特有のタグを文字列として扱うカスタムタイプ
/**
 * CloudFormationの特有のタグを文字列として扱うためのカスタムタイプの配列です。
 * @type {yaml.Type[]}
 */
const cfnTags = [
  /**
   * `!Ref` タグを文字列として扱います。
   * @type {yaml.Type}
   */
  new yaml.Type('!Ref', {
    kind: 'scalar',
    resolve: () => true,
    construct: (data) => `!Ref ${data}`
  }),
  /**
   * `!FindInMap` タグを文字列として扱います。
   * @type {yaml.Type}
   */
  new yaml.Type('!FindInMap', {
    kind: 'sequence',
    resolve: () => true,
    construct: (data) => `!FindInMap ${JSON.stringify(data)}`
  }),
  /**
   * `!GetAtt` タグを文字列として扱います。
   * @type {yaml.Type}
   */
  new yaml.Type('!GetAtt', {
    kind: 'scalar',
    resolve: () => true,
    construct: (data) => `!GetAtt ${data}`
  }),
  /**
   * `!Sub` タグを文字列として扱います。
   * @type {yaml.Type}
   */
  new yaml.Type('!Sub', {
    kind: 'scalar',
    resolve: () => true,
    construct: (data) => `!Sub ${data}`
  })
];
// カスタムタグを含むカスタムスキーマを作成
const customYamlSchema = yaml.DEFAULT_SCHEMA.extend(cfnTags);

// YAMLファイルを読み込み、解析する関数
const loadYamlData = async (filePath) => {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const yamlText = await response.text();
    // カスタムスキーマを使用してYAMLを解析
    const doc = yaml.load(yamlText, { schema: customYamlSchema });

    // 各セクションを個別の変数に割り当て
    const parameters = doc.Parameters || {};
    const mappings = doc.Mappings || {};
    const resources = doc.Resources || {};
    const outputs = doc.Outputs || {};
    
    // 各セクションの中身を論理IDで細分化し、グループ化
    const parametersGrp = extractSectionKeys(parameters);
    const mappingsGrp = extractSectionKeys(mappings);
    const resourcesGrp = extractSectionKeys(resources);
    const outputsGrp = extractSectionKeys(outputs);
    const subValuesArray = [...new Set(resourcesGrp.map(resource => resource.values[0].subValue.replace('AWS::', '')))];
    // 各セクションを含むオブジェクトを返す
    return { parametersGrp, mappingsGrp, resourcesGrp, outputsGrp,subValuesArray };
  } catch (error) {
    console.error("YAMLファイルの読み込みエラー:", error);
    throw error;
  }
};
/**
 * 各セクションのキー（リソースID）を二次元配列として取得する関数
 * @param {Object} section セクション
 * @returns {Array} 各セクションのキーを含む二次元配列
 */
const extractSectionKeys = (section) => {
  return Object.entries(section).map(([key, value]) => {
    return {
      key,
      values: Object.entries(value).map(([subKey, subValue]) => ({
        subKey,
        subValue
      }))
    };
  });
};
export default loadYamlData;