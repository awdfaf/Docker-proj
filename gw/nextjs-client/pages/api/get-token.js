// pages/api/get-token.js
import axios from 'axios';
import queryString from 'query-string';

export default async function handler(req, res) {
  try {
    const sendData = req.body;
    const encodedData = queryString.stringify(sendData);

    const response = await axios({
      method: 'POST',
      url: 'https://testapi.openbanking.or.kr/oauth/2.0/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: encodedData,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response.status).json(error.response.data);
  }
}
