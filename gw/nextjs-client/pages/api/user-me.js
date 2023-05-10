// pages/api/user-me.js
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios({
      method: 'GET',
      url: `https://testapi.openbanking.or.kr/v2.0/user/me?user_seq_no=${req.query.user_seq_no}`,
      headers: {
        Authorization: req.headers.authorization,
        
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response.status).json(error.response.data);
  }
}
