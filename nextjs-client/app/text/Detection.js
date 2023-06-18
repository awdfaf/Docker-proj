'use client'

import { useState } from 'react';
import { Textarea  } from '@nextui-org/react';
import { Button, Card } from "@nextui-org/react";

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
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div>
                <Textarea
                    style={{width : "500px"}}
                    onChange={handleTextChange} 
                    placeholder="탐지할 문자를 입력하세요."
                />
            </div>
            <div>
                <Button bordered color="primary" auto onClick={handleAnalyze}>
                    Primary
                </Button>
            </div>
        </div>
            <hr />
            <Card css={{ mw: "800px" }}>
                <Card.Body>
                    <dvi>{responseData}</dvi>
                </Card.Body>
            </Card> 
        </div>
    )
}
