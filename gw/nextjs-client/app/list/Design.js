import React from "react";

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
        <button className="qr-button" onClick={handleQrButton}>
            qr코드
        </button>
        <button className="balance-button" onClick={handleBalanceButton}>
            잔액조회
        </button>
        </div>
    </div>
    );
}
