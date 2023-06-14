import React from 'react';
import Authbutton from './Authbutton';
import Link from 'next/link'


export default function Authpage() {
    return (
    <div>
        
        
            <span >
                <button className="home-button">MAIN</button>
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
            </span>
        
        <span>
        <h2>사용자ㅁㅇㅈㅁ 인증</h2>
        </span>
        <Authbutton></Authbutton>
    </div>
    );
}