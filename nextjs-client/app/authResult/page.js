import Authresult from "./Authresult";
import Link from 'next/link'




export default function Authresultpage(){
    
    return(
        
        <div>
            <h2>인증 결과</h2>
            <hr />
            <Authresult></Authresult>
            <hr/>
            <Link href="/list">계좌 목록 보기</Link>
        </div>
    )
}