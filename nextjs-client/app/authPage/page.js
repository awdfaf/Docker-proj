

import React from 'react';
import Authbutton from './Authbutton';
import Nav from './Navation.js';

export default function Authpage() {
    return (
        <div>
            <Nav></Nav>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div>
                    <h2>사용자 인증</h2>
                </div>
                <div>
                    <Authbutton style={{ justifyContent: "center" }}></Authbutton>
                </div>
            </div>
        </div>
    );
}
