'use client'

import React, { useState } from 'react';

export default function GCP_storage() {

  const [yourFile, setYourFile] = useState(null);
  const [uploadUrl, setUploadUrl] = useState(null);

  const submit = async event => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', yourFile);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const url = await response.text();
      setUploadUrl(url);
    } else {
      console.error('Upload failed');
    }
  };
  

  return (
    <form onSubmit={submit}>
      <input type="file" onChange={e => setYourFile(e.target.files[0])} />
      <button type="submit">Upload</button>
      {uploadUrl && <p>Uploaded to: {uploadUrl}</p>}
    </form>
  )
  
}
