'use client'

import React, { useEffect, useState } from "react";

import Slider from "react-slick";

import ModalCard from "./ModalCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ModalWithdraw({ tofintechno }) {



const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const [accountList, setAccountList] = useState([]);
    
    useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const userSeqNo = localStorage.getItem('userSeqNo');
    getUserAccountList(accessToken, userSeqNo);
    }, []);

    const getUserAccountList = async (accessToken, userSeqNo) => {
        const response = await fetch(`/api/user-me?user_seq_no=${userSeqNo}`, {
            headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

        const data = await response.json();
        console.log(data.res_list);
        setAccountList(data.res_list);
    };


    return (
        <div className="ModalWithdrawBlock">
      <Slider {...settings}>
        {accountList.map((account) => {
          return (
            <ModalCard
            key={account.fintech_use_num}
            bankName={account.bank_name}
            fintechUseNo={account.fintech_use_num}
            tofintechno={tofintechno}
          ></ModalCard>
            
          );
        })}
      </Slider>
    </div>
    )
}