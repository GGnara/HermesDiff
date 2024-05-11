import yaml from 'js-yaml';

// CloudFormationの特有のタグを文字列として扱うカスタムタイプ
const cfnTags = [
  new yaml.Type('!Ref', {
    kind: 'scalar',
    resolve: () => true,
    construct: (data) => `!Ref ${data}`
  }),
  new yaml.Type('!FindInMap', {
    kind: 'sequence',
    resolve: () => true,
    construct: (data) => `!FindInMap ${JSON.stringify(data)}`
  }),
  new yaml.Type('!GetAtt', {
    kind: 'scalar',
    resolve: () => true,
    construct: (data) => `!GetAtt ${data}`
  }),
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

    // 各セクションを含むオブジェクトを返す
    return { parameters, mappings, resources, outputs };
  } catch (error) {
    console.error("YAMLファイルの読み込みエラー:", error);
    throw error;
  }
};


export default loadYamlData;