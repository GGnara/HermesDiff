import axios from 'axios';

export const fetchAwsData = async (accessKeyId, secretAccessKey, region) => {
  try {
    const response = await axios.get('http://localhost:53906/execute-aws-cli', {
      headers: {
        'x-aws-access-key-id': accessKeyId,
        'x-aws-secret-access-key': secretAccessKey,
        'x-aws-region': region,
      },
    });
    return response.data;
  } catch (error) {
    console.error('エラーが発生しました:', error);
    throw error;
  }
};