'use client'

import React, { useEffect, useState } from "react";
import queryString from "query-string";
import { useSearchParams } from 'next/navigation';
import Transactionlist from "./TransactionList";

export default function Balance() {
  const router = useSearchParams();
  const queryStr = router.toString();
  const parsedQuery = queryString.parse(queryStr);
  const fintechUseNo = parsedQuery.fintechUseNo;
  const [balance, setBalance] = useState("0");
  const [transactionList, setTransactionList] = useState([]);

  useEffect(() => {
    console.log(fintechUseNo);
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      getBalance(accessToken, fintechUseNo);
      getTransactionList(accessToken, fintechUseNo);
    }
  }, []);

  const getBalance = async (accessToken, fintechUseNo) => {
    const tranDtime = "20230510090000";
    const response = await fetch(`/api/get-balance?accessToken=${accessToken}&fintechUseNo=${fintechUseNo}&tranDtime=${tranDtime}`);
    const data = await response.json();
    console.log(data);
    setBalance(data);
  };

  const getTransactionList = async (accessToken, fintechUseNo) => {
    const sendData = {
      fintech_use_num: fintechUseNo,
      inquiry_type: "A",
      inquiry_base: "D",
      from_date: "20220101",
      to_date: "20220101",
      sort_order: "D",
      tran_dtime: "20220710160600",
    };

    const response = await fetch(`/api/get-transaction-list?accessToken=${accessToken}&fintechUseNo=${fintechUseNo}&sendData=${JSON.stringify(sendData)}`);
    const data = await response.json();
    console.log(data);
    setTransactionList(data.res_list);
  };

  



  return (
    <div>
      <div className="balance-block">
        <div className="bank-name">{balance.bank_name}</div>
        <div className="fintech-no">{fintechUseNo}</div>
        <div className="balance-text">{balance.balance_amt}원</div>
        <Transactionlist transactionList={transactionList}></Transactionlist>
      </div>
    </div>
  );
}
