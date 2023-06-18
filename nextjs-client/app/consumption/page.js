import Consume from "./Consume";
import Nav from './Navation.js'

export default function Consumepage() {
    return(
        <div>
            <Nav></Nav>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <h2>거래 내역 분석 시각화</h2>
            </div>
            <Consume></Consume>
        </div>
    )
}