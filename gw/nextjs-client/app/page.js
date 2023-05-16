import { Storage } from "@google-cloud/storage";

export default async function Home() {
  
  const {Storage} = require('@google-cloud/storage');

  const storage = new Storage({
    projectId: 'helical-button-381600',
    keyFilename: '../helical-button-381600-33e40d727182.json' // 서비스 계정 키 파일 경로
  });

  const bucket = storage.bucket('awdfaf_storage');

  const file = bucket.file('aaa.png');

  file.createWriteStream()
    .on('error', function(err) {})
    .on('finish', function() {
      // The file upload is complete.
    })
    .end('./aaa.png');

  return (
      <div>
        시작페이지
      </div>
      
  )
}