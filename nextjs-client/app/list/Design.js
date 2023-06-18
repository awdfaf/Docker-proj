'use client'
import React from "react";
import { Button, Grid } from "@nextui-org/react";

export default function MainCard({ bankName, fintechUseNo, accountNum }) {
    const handleQrButton = () => {
    window.location.href = `/qr?fintechUseNo=${fintechUseNo}`;
    };

    const handleBalanceButton = () => {
    window.location.href = `/balance?fintechUseNo=${fintechUseNo}`;
    };

    return (
    <div className="card-block">
        <div className="card-title">{bankName}</div>
        <div className="fintech-use-no">{fintechUseNo}</div>
        <div className="account-no">계좌번호 : {accountNum}</div>
        <div className="button-block">
        <Grid.Container gap={2}>
            <Grid>
                <Button bordered color="primary" auto onClick={handleQrButton}>
                    qr코드
                </Button>
            </Grid>
            <Grid>
                <Button bordered color="secondary" auto onClick={handleBalanceButton}>
                    잔액조회
                </Button>
            </Grid>
        </Grid.Container>
        </div>
    </div>
    );
}
