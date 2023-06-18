import Detection from "./Detection";
import Nav from "./Navation.js";

export default function Text() {
    return(
        <div>
            <Nav></Nav>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <h2>스미싱 탐지</h2>
            </div>
            <Detection></Detection>
        </div>
    )
}