import axios from "axios";

export default async function handler(req, res) {
  const { accessToken, fintechUseNo, tranDtime } = req.query;
  const bankTranId = "M202201320U" + Math.floor(Math.random() * 1000000000 + 1);

  try {
    const response = await axios.get("https://testapi.openbanking.or.kr/v2.0/account/balance/fin_num", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        bank_tran_id: bankTranId,
        fintech_use_num: fintechUseNo,
        tran_dtime: tranDtime,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}
