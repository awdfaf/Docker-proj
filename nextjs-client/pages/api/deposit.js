import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { data } = req.body;

    try {
      const response = await axios({
        method: 'POST',
        url: 'https://testapi.openbanking.or.kr/v2.0/transfer/deposit/fin_num',
        headers: {
          Authorization: `bearer ${data.twoLeggedToken}`,
          'Content-Type': 'application/json',
        },
        data: data.sendData,
      });

      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
