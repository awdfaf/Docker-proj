from flask import Flask, request, jsonify # Flask
from flask_cors import CORS
import os
from phishing.voice import Voice
from phishing.text import Text
import pandas as pd
from bankanalysis import bankanalysis

app = Flask(__name__)
CORS(app)


# ------------------------------------------------------------
UPLOAD_FOLDER = './audio'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# 개발과정에서 시간단축을 위한 주석
# txt = Text()

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
    # 개발과정에서 시간단축을 위한 주석
    # vp = Voice()
    # res = vp.result(file_path)
    res = ''
    # 응답을 반환합니다.
    return res
# ------------------------------------------------------------

@app.route('/api/analyze', methods=['POST'])
def upload_text_files():
    input_text = request.data.decode('utf-8')  # 입력 텍스트를 받아옴
    
    # 개발과정에서 시간단축을 위한 주석
    #result = txt.detect_fraud_sms(input_text)  # 받아온 텍스트를 처리
    result=''
    return result

# ------------------------------------------------------------

@app.route('/api/getChart', methods=['GET'])
def get_chart():
    bank = request.args.get('bank', 'kakaobank')  # 기본값은 'Abank'
    
    # 각 은행에 따라 다른 데이터를 반환합니다. 
    # 실제 사용할 때에는 여기에서 각 은행의 실제 데이터를 가져와서 JSON으로 변환하는 코드를 추가해야 합니다.
    
    data = bankanalysis(bank)
    # if bank == 'kakaobank':
    #     df = pd.read_excel('./Transaction/kakaobank_card.xlsx')
        
    #     data = {
    #         'bank': 'kakaobank',
    #         'filename': 'file1.csv',
    #         'df': pd.DataFrame({'A': [1, 2, 3]}).to_json(),
    #         'total_df': pd.DataFrame({'B': [4, 5, 6]}).to_json(),
    #     }
    # elif bank == 'Bbank':
    #     data = {
    #         'bank': 'Bbank',
    #         'filename': 'file2.csv',
    #         'df': pd.DataFrame({'C': [7, 8, 9]}).to_json(),
    #         'total_df': pd.DataFrame({'D': [10, 11, 12]}).to_json(),
    #     }
    # elif bank == 'Cbank':
    #     data = {
    #         'bank': 'Cbank',
    #         'filename': 'file3.csv',
    #         'df': pd.DataFrame({'E': [13, 14, 15]}).to_json(),
    #         'total_df': pd.DataFrame({'F': [16, 17, 18]}).to_json(),
    #     }
    # else:
    #     return jsonify({'error': 'Invalid bank name'}), 400  # HTTP 400: Bad Request
    
    return jsonify(data)
    
    
    
    
    
    
    

if __name__ == "__main__":
    app.run(debug = True)
    

