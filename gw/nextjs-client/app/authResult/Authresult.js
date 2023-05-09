'use client'
import { useSearchParams } from 'next/navigation';
import queryString from 'query-string';
import axios from 'axios'


export default function Authresult() {
    const router = useSearchParams();
    const queryStr = router.toString(); // URLSearchParams 객체를 문자열로 변환합니다.
    const parsedQuery = queryString.parse(queryStr); // 문자열을 파싱하여 객체 형식으로 변환합니다.
    const code = parsedQuery.code
    // const [accessToken, setAccessToken] = useState('토큰이 없습니다.')
    // const [userSeqNo, setUserSeqNo] = useState('사용자 번호가 없습니다.')

    const handleGetAccessToeknClick = () => {
        const sendData = {
            code:code,
            client_id:"0135b90b-a1d9-472a-9dba-53f2a93703f5",
            client_secret:"9ec18858-bf9f-4d75-8f3d-80e2ce34e082",
            redirect_uri:"http://localhost:3000/authResult",
            grant_type:"authorization_code",
        }
        const encodedData = queryString.stringify(sendData);
    
        const option = {
            method : "POST",
            url: "https://testapi.openbanking.or.kr/oauth/2.0/token",
            headers: {
                "Content-Type" : "application/x-www-form-urlencoded"
            },
            data: encodedData
        }
        
        axios(option).then((response) => {
            console.log(response);
        })
    }
    
    

    return(
        <div>
            <p>인증코드: {code}</p>
            <button onClick={handleGetAccessToeknClick}>인증 요청</button>
            <p>accessToken: </p>
            <p>userSeqNo: </p>
        </div>
    )
}