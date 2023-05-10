import axios from "axios";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const apiURL = "https://testapi.openbanking.or.kr/v2.0/transfer/withdraw/fin_num";
    const accessToken = req.headers.authorization;
    const { data: sendData } = req.body;

    try {
      const response = await axios.post(apiURL, sendData, {
        headers: {
          Authorization: accessToken,
        },
      });

      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
