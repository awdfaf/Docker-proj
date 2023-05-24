from flask import Flask, request, jsonify # Flask
from flask_cors import CORS
import os
from data.voice import Voice
from data.text import Text

app = Flask(__name__)
CORS(app)


# ------------------------------------------------------------
UPLOAD_FOLDER = './audio'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

txt = Text()

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
    vp = Voice()
    res = vp.result(file_path)
    # 응답을 반환합니다.
    return res
# ------------------------------------------------------------

@app.route('/api/analyze', methods=['POST'])
def upload_text_files():
    input_text = request.data.decode('utf-8')  # 입력 텍스트를 받아옴
    
    result = txt.detect_fraud_sms(input_text)  # 받아온 텍스트를 처리
    
    return result

if __name__ == "__main__":
    app.run(debug = True)
    

