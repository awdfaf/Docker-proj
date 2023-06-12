import Getitems from "./Getitems";
import Link from 'next/link'

export default function List(){

    

    return(
        <div>
            <h2>계좌 목록</h2>
            <span className="link-container">
            <Link href="/qrreader">QR코드 리더</Link>
            </span>
            <span className="link-container">
            <Link href="/consumption">소비 패턴 분석</Link>
            </span>
            <span className="link-container">
            <Link href="/outlier">이상치 탐지</Link>
            </span>
            <hr />
            <Getitems></Getitems>
        </div>
    )
}