'use client'

import queryString from "query-string";
import { useSearchParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';

export default function QRcode() {
    const router = useSearchParams();
    const queryStr = router.toString();
    const parsedQuery = queryString.parse(queryStr);
    const fintechUseNo = parsedQuery.fintechUseNo;
    // console.log(fintechUseNo)
    return (
        <div>
            <h2>QR코드</h2>
            <hr />
            <div className="qr-block">
                <QRCodeSVG size={200} value={fintechUseNo} />
                {/* <p>{fintechUseNo}</p> */}
            </div>
        </div>
    )
}