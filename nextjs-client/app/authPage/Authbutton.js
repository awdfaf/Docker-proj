'use client'

export default function Authbutton() {

    const handleAuthButtonClick = () => {
        const clientId = "0135b90b-a1d9-472a-9dba-53f2a93703f5"
        // ****** 여러분들의 clientId 입력해주세요 ******
        const authPageUrl = `https://testapi.openbanking.or.kr/oauth/2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=http://localhost:3000/authResult&scope=login inquiry transfer&state=12345678901234567890123456789012&auth_type=0`
        // console.log(authPageUrl);   
        //새창으로 인증사이트를 오픈 
        let tmpwindow = window.open("about:blank");
        tmpwindow.location.href = authPageUrl;
    }


    return (
    <div>
        <button className="auth-button" 
                onClick={ handleAuthButtonClick }>인증 하기</button>
    </div>
    );
}