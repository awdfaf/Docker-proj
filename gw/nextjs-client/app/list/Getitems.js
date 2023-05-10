'use client'
import { useEffect } from 'react';
import { useState } from 'react';
import Design from './Design';

export default function Getitems() {

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
        <div>
        
        {
        accountList.map((item, index) => (
            <div key={index}>
                <Design bankName={item.bank_name} 
                        fintechUseNo={item.fintech_use_num}
                        accountNum={item.account_num_masked}></Design>
            </div>
        ))
        }
        </div>
    )
}
