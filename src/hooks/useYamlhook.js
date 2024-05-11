import { useState, useEffect } from 'react';
import yaml from 'js-yaml';

const useYamlhook = (filePath) => {
  const [alarmConfig, setAlarmConfig] = useState({});

  useEffect(() => {
    // パブリックディレクトリ内のYAMLファイルにフェッチリクエストを行う
    fetch(filePath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(yamlText => {
        // パースしたYAMLを状態にセット
        const parsedYaml = yaml.load(yamlText);
        setAlarmConfig(parsedYaml);
      })
      .catch(error => {
        console.error("読み込みエラー:", error);
      });
  }, [filePath]); // filePathが変わるたびに効果を再実行

  useEffect(() => {
    //console.log("alarmConfigの中身（整形済み）:", JSON.stringify(alarmConfig, null, 2));
  }, [alarmConfig]);

  return alarmConfig;
};



export default useYamlhook;
