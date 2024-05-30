import axios from 'axios';
import store from '../store.js';

export const fetchAwsData = async (accessKeyId, secretAccessKey, region) => {
  try {
    const stackName = store.getState().StackName; // StoreStackNameを取得
    console.log(stackName)
    const response = await axios.get('http://localhost:53906/execute-aws-cli', {
      headers: {
        'x-aws-access-key-id': accessKeyId,
        'x-aws-secret-access-key': secretAccessKey,
        'x-aws-region': region,
        'x-stack-name': stackName // ヘッダーに追加
      },
    });
    return response.data;
  } catch (error) {
    console.error('エラーが発生しました:', error);
    throw error;
  }
};

export const fetchAwsStackDetails = async (accessKeyId, secretAccessKey, region, stackId) => {
  try {
    const stackName = store.getState().StackName; // StoreStackNameを取得
    console.log(stackName)
    const response = await axios.get('http://localhost:53906/execute-aws-cli-stack-details', {
      headers: {
        'x-aws-access-key-id': accessKeyId,
        'x-aws-secret-access-key': secretAccessKey,
        'x-aws-region': region,
        'x-stack-name': stackName
      },
    });
    return response.data;
  } catch (error) {
    console.error('エラーが発生しました:', error);
    throw error;
  }
};