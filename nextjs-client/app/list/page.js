'use client'

import Getitems from "./Getitems";
import Link from 'next/link'
import Nav from './Navation.js'
import { Button } from "@nextui-org/react";

export default function List(){

    const handleButtonClick = (link) => {
        window.location.href = link;
      };

    return(
        <div>
            <Nav></Nav>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <h2>계좌 목록</h2>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Button.Group color="gradient" ghost>
                    <Button onClick={() => handleButtonClick("/qrreader")} style={{ width: "200px" }}>QR코드 리더</Button>
                    <Button onClick={() => handleButtonClick("/consumption")} style={{ width: "200px" }}>소비 패턴 분석</Button>
                    <Button  style={{ width: "200px" }}>이상치 탐지</Button>
                </Button.Group>
            </div>
            <hr />
            <Getitems></Getitems>
        </div>
    )
}