import pandas as pd
import numpy as np
import torch
import torch.nn as nn
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer
from torch.utils.data import DataLoader, Dataset
from konlpy.tag import Okt

class SmishingDetector:
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.transformer = None
        self.okt = Okt()

    def preprocess_text(self, text):
        morphs = self.okt.morphs(text, stem=True)
        processed_text = ' '.join(morphs)
        return processed_text

    def load_model(self, model_file):
        # 모델 불러오기
        input_size = len(self.vectorizer.vocabulary_)
        hidden_size = 128
        num_classes = 2

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

        self.model = LSTMModel(input_size, hidden_size, num_classes)
        self.model.load_state_dict(torch.load(model_file))

    def train(self, data_file, ip_url_file):
        # 데이터 읽기
        data = pd.read_csv(data_file)
        text = data['text'].values
        labels = data['label'].values

        # 사기 IP 및 URL 데이터 읽기
        fraud_data = pd.read_csv(ip_url_file)
        fraud_ip_urls = fraud_data[['IP', 'URL']]

        # 텍스트 데이터와 사기 IP/URL 데이터 병합
        data['ip_url'] = fraud_ip_urls.apply(lambda row: ' '.join([str(row['IP']), str(row['URL'])]), axis=1)
        text_with_ip_url = data['text'] + ' ' + data['ip_url']

        # 텍스트 전처리
        data['processed_text'] = text_with_ip_url.apply(self.preprocess_text)

        # 계층적 샘플링으로 훈련 및 테스트 데이터 분할
        train_texts, test_texts, train_labels, test_labels = train_test_split(data['processed_text'], labels, test_size=0.2, random_state=42)

        # 특성 추출
        self.vectorizer = CountVectorizer()
        train_features = self.vectorizer.fit_transform(train_texts).toarray().astype('float32')
        test_features = self.vectorizer.transform(test_texts).toarray().astype('float32')

        # TF-IDF 특성 계산
        self.transformer = TfidfTransformer()
        train_features = self.transformer.fit_transform(train_features).toarray().astype('float32')
        test_features = self.transformer.transform(test_features).toarray().astype('float32')

        # 사용자 정의 데이터셋 생성
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

        # 데이터로더 생성
        batch_size = 32
        train_dataset = TextDataset(train_features, train_labels)
        train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
        test_dataset = TextDataset(test_features, test_labels)
        test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)

        # 모델 정의
        input_size = train_features.shape[1]
        hidden_size = 128
        num_classes = 2

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

        # 预训练模型的加载
        loaded_model = LSTMModel(input_size, hidden_size, num_classes)  # 创建一个新的模型实例
        loaded_model.load_state_dict(torch.load("./sms_model.pt"))  # 加载模型的状态字典

        # 将加载的模型赋值给类属性
        self.model = loaded_model

    def predict(self, text):
        processed_text = self.preprocess_text(text)
        features = self.vectorizer.transform([processed_text]).toarray().astype('float32')
        features = self.transformer.transform(features).toarray().astype('float32')
        input_tensor = torch.from_numpy(features).unsqueeze(0)

        self.model.eval()
        with torch.no_grad():
            output = self.model(input_tensor)
            _, predicted = torch.max(output, dim=1)
            prob = nn.Softmax(dim=1)(output)[:, 1].item()

        if predicted.item() == 0:
            return f"정상 문자입니다. 스미싱의 확률: {prob*100:.2f}%"
        else:
            return f"스미싱 문자입니다. 스미싱의 확률: {prob*100:.2f}%"