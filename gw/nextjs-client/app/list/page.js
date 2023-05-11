import Getitems from "./Getitems";
import Link from 'next/link'

export default function List(){

    

    return(
        <div>
            <h2>계좌 목록</h2>
            <Link href="/qrreader">QR코드 리더</Link>
            <hr />
            <Getitems></Getitems>
        </div>
    )
}