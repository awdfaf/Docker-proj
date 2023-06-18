'use client'

import queryString from "query-string";
import { useSearchParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import Nav from './Navation.js'

export default function QRcode() {
    const router = useSearchParams();
    const queryStr = router.toString();
    const parsedQuery = queryString.parse(queryStr);
    const fintechUseNo = parsedQuery.fintechUseNo;
    // console.log(fintechUseNo)
    return (
        <div>
            <Nav></Nav>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <h2>QR코드</h2>
            </div>
            
            <hr />
            <div className="qr-block">
                <QRCodeSVG size={200} value={fintechUseNo} />
                {/* <p>{fintechUseNo}</p> */}
            </div>
        </div>
    )
}