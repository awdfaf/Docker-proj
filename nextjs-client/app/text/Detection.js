'use client'

import { useState } from 'react';

export default function TextDetection() {
    const [inputText, setInputText] = useState(''); 
    const [responseData, setResponseData] = useState('');

    const handleTextChange = (event) => {
        setInputText(event.target.value); 
    };

    const handleAnalyze = () => {
        if (inputText) {
            fetch('http://127.0.0.1:5000/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain' // 데이터 타입을 텍스트로 변경
                },
                body: inputText  // 텍스트를 그대로 보냄
            })
            .then(response => response.text())
            .then(data => {
                console.log(data);
                setResponseData(data); 
            })
            .catch(error => {
                console.error(error);
            });
        }
    };

    return (
        <div>
            <textarea 
                onChange={handleTextChange} 
                placeholder="Enter text here..." 
                style={{ width: '400px', height: '200px' }} // 텍스트 박스 크기 조절
            />
            <button onClick={handleAnalyze}>Analyze</button>
            <hr />
            <div>{responseData}</div>
        </div>
    )
}
