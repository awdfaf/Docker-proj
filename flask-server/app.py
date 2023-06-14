from flask import Flask, request, jsonify # Flask
from flask_cors import CORS
import os
from phishing.voice import Voice
from phishing.text import Sms
import pandas as pd
from bankanalysis import bankanalysis
from outlierdetection import detect

app = Flask(__name__)
CORS(app)


# ------------------------------------------------------------
UPLOAD_FOLDER = './audio'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# vp = Voice()
sms = Sms()


@app.route('/api/upload', methods=['POST'])
def upload_voice_files():
    # if 'file' not in request.files:
    #     return 'No file part', 400
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    file = request.files['file']
    # 파일 처리 로직을 구현합니다.
    # 여기서는 예시로 파일 이름을 출력하도록 했습니다.
    filename = file.filename
    print(file.filename)
    file.save('./audio/{}'.format(file.filename))
    file = './audio/{}'.format(file.filename)
    
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    
    
    
    #res = vp.result(file_path)
    res = ''
    return res
# ------------------------------------------------------------

@app.route('/api/analyze', methods=['POST'])
def upload_text_files():
    input_text = request.data.decode('utf-8')  # 입력 텍스트를 받아옴
    
    
    res = sms.detect_fraud_sms(input_text)
    
    return res

# ------------------------------------------------------------

@app.route('/api/getChart', methods=['GET'])
def get_chart():
    bank = request.args.get('bank', 'kakaobank')  # 기본값은 'Abank'
    # 각 은행에 따라 다른 데이터를 반환합니다. 
    # 실제 사용할 때에는 여기에서 각 은행의 실제 데이터를 가져와서 JSON으로 변환하는 코드를 추가해야 합니다.
    data = bankanalysis(bank)
    outlierData = detect(bank)
    data.update(outlierData)
    
    return jsonify(data)
    
# ------------------------------------------------------------


@app.route('/')
def home():
    
    return 'test'
    
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
    

