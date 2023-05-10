'use client'

import React, { useState } from "react";

export default function ModalCard({ bankName, fintechUseNo, tofintechno }) {
  const [amount, setamount] = useState("");

  const genTransId = () => {
    let countnum = Math.floor(Math.random() * 1000000000) + 1;
    let transId = "M202201320U" + countnum; //이용기과번호 본인것 입력
    return transId;
  };

  const handlePayButtonClick = async () => {
    const sendData = {
      bank_tran_id: genTransId(),
      cntr_account_type: "N",
      cntr_account_num: "100000000001",
      dps_print_content: "쇼핑몰환불",
      fintech_use_num: fintechUseNo,
      wd_print_content: "오픈뱅킹출금",
      tran_amt: amount,
      tran_dtime: "20190910101921",
      req_client_name: "홍길동",
      req_client_fintech_use_num: fintechUseNo,
      req_client_num: "HONGGILDONG1234",
      transfer_purpose: "TR",
      recv_client_name: "김오픈",
      recv_client_bank_code: "097",
      recv_client_account_num: "100000000001",
    };

    try {
      const response = await fetch("/api/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ data: sendData }),
      });

      const data = await response.json();
      console.log(data);
      deposit(sendData);
      if (data.rsp_code === "A0002") {
        alert("결제 성공");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const deposit = async (sendData) => {
    const twoLeggedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJNMjAyMjAxMzIwIiwic2NvcGUiOlsib29iIl0sImlzcyI6Imh0dHBzOi8vd3d3Lm9wZW5iYW5raW5nLm9yLmtyIiwiZXhwIjoxNjkxNTAwMjY3LCJqdGkiOiIxZTk2ZmU0Ny05NTFmLTQyZGUtODE3Zi0zZDY0MDAyZTNhNGQifQ.TOXmTsPw2R5xtopKZELOvqVgPYqf8c_LDQlgFOjFI-U";
    const depositData = {
        cntr_account_type: "N",
        cntr_account_num: "200000000001",
        wd_pass_phrase: "NONE",
        wd_print_content: "환불금액",
        name_check_option: "off",
        tran_dtime: "20220710101921",
        req_cnt: "1",
        req_list: [
          {
            tran_no: "1",
            bank_tran_id: genTransId(),
            fintech_use_num: tofintechno,
            print_content: "쇼핑몰환불",
            tran_amt: amount,
            req_client_name: "홍길동",
            req_client_fintech_use_num: fintechUseNo,
            req_client_num: "HONGGILDONG1234",
            transfer_purpose: "TR",
          },   
        ],
    };
    try {
      const response = await fetch("/api/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${twoLeggedToken}`,
        },
        body: JSON.stringify({ data: depositData }),
      });

      const data = await response.json();
      console.log(data);
      if (data.rsp_code === "A0002") {
        alert("결제 성공");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setamount(value);
  };

  return (
    <div className="ModalCardBlock">
      <p className="CardTitle">{bankName}</p>
      <p className="FintechUseNo">{fintechUseNo}</p>
      <p>{tofintechno}로 돈을 보냅니다.</p>
      <input onChange={handleChange}></input>
      <button className="WithDrawButton" onClick={handlePayButtonClick}>
        결제하기
      </button>
    </div>
  );
}