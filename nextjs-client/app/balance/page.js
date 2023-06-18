import Balance from "./Balance";
import Nav from './Navation.js'



export default function BalancePage() {

    return(
        <div>
            <Nav></Nav>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <h2>잔액 조회</h2>
            </div>
            <hr />
            <Balance></Balance>
        </div>
    )
}