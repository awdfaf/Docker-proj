'use client'

import Authresult from "./Authresult";
import { Link } from "@nextui-org/react";

import Nav from './Navation.js'


export default function Authresultpage(){
    
    return(
        <div>
            <Nav></Nav>
            <div className="container">
                <h2>인증 결과</h2>
                <hr />
                <Authresult></Authresult>
                <hr/>
                <Link href="/list">계좌 목록 보기</Link>
            </div>
        </div>
    )
}