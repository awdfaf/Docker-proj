import pandas as pd
import numpy as np
import torch
import torch.nn as nn
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer
from torch.utils.data import DataLoader, Dataset
from konlpy.tag import Okt


class Sms:
    def __init__(self):
        # 데이터 로드...
        data = pd.read_csv("./phishing/스미싱문자 찐최종.csv")
        text = data['text'].values
        labels = data['label'].values

        # 사기 IP 및 URL 데이터 로드...
        fraud_data = pd.read_csv("./phishing/sms_ip(최종).csv")
        fraud_ip_urls = fraud_data[['IP', 'URL']]

        # 텍스트 데이터와 사기 IP/URL 데이터 결합...
        data['ip_url'] = fraud_ip_urls.apply(lambda row: ' '.join([str(row['IP']), str(row['URL'])]), axis=1)
        text_with_ip_url = data['text'] + ' ' + data['ip_url']

        # KoNLPy를 사용하여 텍스트 토큰화...
        okt = Okt()
        stop_words = pd.read_csv("https://raw.githubusercontent.com/yoonkt200/FastCampusDataset/master/korean_stopwords.txt",
                                header=None)

        def preprocess_text(text):
            morphs = okt.morphs(text, stem=True)
            morphs = [word for word in morphs if word not in stop_words.values.flatten()]
            pos_tags = okt.pos(text, stem=True)
            nouns_verbs = [word for word, pos in pos_tags if pos in ['Noun', 'Verb']]
            processed_text = ' '.join(nouns_verbs)
            return processed_text

        data['processed_text'] = text_with_ip_url.apply(preprocess_text)

        # 학습 및 테스트 데이터 분할...
        train_texts, test_texts, train_labels, test_labels = train_test_split(data['processed_text'], labels,
                                                                            test_size=0.2, random_state=42)

        # 텍스트 전처리 및 특성 추출...
        vectorizer = CountVectorizer()
        train_features = vectorizer.fit_transform(train_texts).toarray().astype('float32')
        test_features = vectorizer.transform(test_texts).toarray().astype('float32')

        # TF-IDF 특성 계산...
        transformer = TfidfTransformer()
        train_features = transformer.fit_transform(train_features).toarray().astype('float32')
        test_features = transformer.transform(test_features).toarray().astype('float32')

        # 사용자 정의 데이터셋...
        class TextDataset(Dataset):
            def __init__(self, features, labels):
                self.features = features
                self.labels = labels

            def __len__(self):
                return len(self.features)

            def __getitem__(self, index):
                feature = self.features[index]
                label = self.labels[index]
                return torch.from_numpy(feature).unsqueeze(0), label

        # 데이터 로더...
        batch_size = 32
        train_dataset = TextDataset(train_features, train_labels)
        train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
        test_dataset = TextDataset(test_features, test_labels)
        test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)

        # LSTM 모델 정의...
        class LSTMModel(nn.Module):
            def __init__(self, input_size, hidden_size, num_classes):
                super(LSTMModel, self).__init__()
                self.hidden_size = hidden_size
                self.lstm = nn.LSTM(input_size, hidden_size, batch_first=True)
                self.fc = nn.Linear(hidden_size, num_classes)

            def forward(self, x):
                out, _ = self.lstm(x)
                out = out[:, -1, :]
                out = self.fc(out)
                return out

        # 모델 매개변수...
        input_size = train_features.shape[1]
        hidden_size = 128
        num_classes = 2

        # 모델 로드...
        self.model = LSTMModel(input_size, hidden_size, num_classes)
        self.model.load_state_dict(torch.load("./model/sms_model.pt"))
        self.model.eval()

        # 예측 함수...
        def predict_text(text):
            processed_text = preprocess_text(text)
            features = vectorizer.transform([processed_text]).toarray().astype('float32')
            features = transformer.transform(features).toarray().astype('float32')
            input_tensor = torch.from_numpy(features).unsqueeze(0)

            with torch.no_grad():
                output = self.model(input_tensor)
                _, predicted = torch.max(output, dim=1)
                prob = nn.Softmax(dim=1)(output)[:, 1].item()

            if predicted.item() == 0:
                return f"정상 문자, 사기 확률: {prob * 100:.2f}%"
            else:
                return f"사기 문자, 사기 확률: {prob * 100:.2f}%"

        self.predict_text = predict_text  # 예측 함수 설정