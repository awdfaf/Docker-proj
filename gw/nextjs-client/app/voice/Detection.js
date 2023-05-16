'use client'

import { useState } from 'react';

export default function Detection() {

    const [selectedFile, setSelectedFile] = useState(null);
    const [responseData, setResponseData] = useState('');

    const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    };

    const handleUpload = () => {
    if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        fetch('http://127.0.0.1:5000/api/upload', {
        method: 'POST',
        body: formData
        })
        .then(response => response.text())
        .then(data => {
            // 서버로부터의 응답 처리
            console.log(data);
            setResponseData(data); // 데이터를 상태 변수에 저장
        })
        .catch(error => {
            // 에러 처리
            console.error(error);
        });
    }
    };

    return (
    <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
        <hr />
        <dvi>{responseData}</dvi>
    </div>
    )
}