'use client'
import { useSearchParams } from 'next/navigation';
import queryString from 'query-string';
import axios from 'axios';
import { useState } from 'react';
import { Button } from '@nextui-org/react';
import { Input } from "@nextui-org/react";
import { Card, Text } from "@nextui-org/react";


export default function Authresult() {
  const router = useSearchParams();
  const queryStr = router.toString();
  const parsedQuery = queryString.parse(queryStr);
  const code = parsedQuery.code;
  const [accessToken, setAccessToken] = useState('토큰이 없습니다.');
  const [userSeqNo, setUserSeqNo] = useState('사용자 번호가 없습니다.');

  const handleGetAccessToeknClick = () => {
    const sendData = {
      code: code,
      client_id: '0135b90b-a1d9-472a-9dba-53f2a93703f5',
      client_secret: '9ec18858-bf9f-4d75-8f3d-80e2ce34e082',
      redirect_uri: 'http://localhost:3000/authResult',
      grant_type: 'authorization_code',
    };

    axios
      .post('/api/get-token', sendData)
      .then((data) => {
        console.log(data);
        if (data.data.rsp_code === 'O0001') {
          alert('인증코드가 만료되었습니다. 인증을 다시 진행해 주세요');
        } else {
          setAccessToken(data.data.access_token);
          setUserSeqNo(data.data.user_seq_no);
          localStorage.setItem('accessToken', data.data.access_token);
          localStorage.setItem('userSeqNo', data.data.user_seq_no);
        }
      });
  };

  return (
    <div>
    <Card css={{ mw: "400px" }}>
        <Card.Body>
            <Text>
                인증코드: {code}
            </Text>
        </Card.Body>
    </Card>
    <Button bordered color="primary" auto onClick={handleGetAccessToeknClick} style={{ width: "400px" }}>인증하기</Button>
    <p style={{ 
        width: '400px', 
        overflow: 'hidden', 
        textOverflow: 'ellipsis', 
        whiteSpace: 'nowrap',
        wordWrap: 'break-word'
    }}>accessToken : {accessToken}</p>
    <p>userSeqNo : {userSeqNo}</p>
</div>
  );
}
