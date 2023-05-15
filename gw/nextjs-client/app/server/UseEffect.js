'use client'

import { useEffect } from "react"

export default function UseEffect() {

    useEffect(() => {
    fetch("http://127.0.0.1:5000/detection").then(
        // response 객체의 json() 이용하여 json 데이터를 객체로 변화
        res => res.json()
    ).then(
        // 데이터를 콘솔에 출력
        data => console.log(data)
    )
    },[])
    return(
        <div>adasd</div>
    )


}