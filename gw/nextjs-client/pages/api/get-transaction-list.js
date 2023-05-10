import axios from "axios";

export default async function handler(req, res) {
  const { accessToken, fintechUseNo, sendData } = req.query;

  const modifiedSendData = {
    ...JSON.parse(sendData),
    bank_tran_id: genTransId(),
  };

  const apiOptions = {
    method: "GET",
    url: "https://testapi.openbanking.or.kr/v2.0/account/transaction_list/fin_num",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: modifiedSendData,
  };

  try {
    const apiRes = await axios(apiOptions);
    const data = apiRes.data;

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching transaction list" });
  }
}

function genTransId() {
  let countnum = Math.floor(Math.random() * 1000000000) + 1;
  let transId = "M202201320U" + countnum; // 이 부분은 은행별로 상이할 수 있습니다.
  return transId;
}
