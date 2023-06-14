import pickle
import pandas as pd
import numpy as np
import re
import urllib.request
from tqdm import tqdm
import time

from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model

import speech_recognition as sr
import pyaudio
from konlpy.tag import Okt

from pydub import AudioSegment
import wave
import contextlib
import os


class Voice:
    def __init__(self, ):
        
        self.r = sr.Recognizer()
        
        self.loaded_model = load_model("./model/all_best_model.h5")
        self.type1_model = load_model("./model/type1_best_model.h5")
        self.type2_model = load_model("./model/type2_best_model.h5")
        self.stopwords = pd.read_csv("https://raw.githubusercontent.com/yoonkt200/FastCampusDataset/master/korean_stopwords.txt").values.tolist()
        self.df = pd.read_csv("./phishing/call_all.csv")
        self.df = self.df.dropna(how="any")
        self.train_data = self.df[:600]
        self.test_data = self.df[600:]
        
        self.train_data.drop_duplicates(subset=["text"], inplace=True)
        self.train_data["text"] = self.train_data["text"].str.replace("[^ㄱ-ㅎㅏ-ㅣ가-힣 ]", "", regex=True)
        self.train_data["text"] = self.train_data["text"].str.replace("^ +", "", regex=True)
        self.train_data["text"].replace("", np.nan, inplace=True)
        self.train_data = self.train_data.dropna(how="any")
        self.okt = Okt()
        
        self.X_train = []
        for sentence in tqdm(self.train_data["text"]):
            tokenized_sentence = self.okt.morphs(sentence, stem=True)
            stopwords_removed_sentence = [word for word in tokenized_sentence if not word in self.stopwords]
            self.X_train.append(stopwords_removed_sentence)
        
        self.test_data["text"] = self.test_data["text"].str.replace("[^ㄱ-ㅎㅏ-ㅣ가-힣 ]", "", regex=True)
        self.test_data["text"] = self.test_data["text"].str.replace("^ +", "", regex=True)
        self.test_data["text"].replace("", np.nan, inplace=True)
        self.test_data = self.test_data.dropna(how="any")
        
        self.X_test = []
        for sentence in tqdm(self.test_data["text"]):
            tokenized_sentence = self.okt.morphs(sentence, stem=True)
            stopwords_removed_sentence = [word for word in tokenized_sentence if not word in self.stopwords]
            self.X_test.append(stopwords_removed_sentence)
        
        self.tokenizer = Tokenizer(2664)
        self.tokenizer.fit_on_texts(self.X_train)
        self.X_train = self.tokenizer.texts_to_sequences(self.X_train)
        self.X_test = self.tokenizer.texts_to_sequences(self.X_test)
        self.y_train = np.array(self.train_data["phishing"])
        self.y_test = np.array(self.test_data["phishing"])
        self.X_train = pad_sequences(self.X_train, maxlen=800)
        self.X_test = pad_sequences(self.X_test, maxlen=800)
        
        self.cnt = 1
        self.type1_cnt = 1
        self.type2_cnt = 1
        self.text = ''
        self.export_cnt = 0
    
    def to_wav(self, file_path):
        try:
            if file_path[file_path.rfind('.')+1:] != 'wav':
                sound = AudioSegment.from_file(file_path) 
                file_path = file_path[:file_path.rfind('.')]+'.wav'
                sound.export(file_path, format="wav")
                self.export_cnt = 1
            
            with contextlib.closing(wave.open(file_path, 'r')) as f:
                frames = f.getnframes()
                rate = f.getframerate()
                duration = frames / float(rate)            
            self.duration_list = [30] * int(duration/30) + [round(duration%30)]            
        except:
            print('Error')
            
    def recognize(self, file_path):
        try:
            with sr.AudioFile(file_path) as source:
                for duration in self.duration_list:
                    self.r.adjust_for_ambient_noise(source, duration=0.5)
                    self.r.dynamic_energy_threshold = True
                    audio = self.r.record(source, duration=duration)
                    try:
                        self.text += self.r.recognize_google(audio_data=audio, language='ko-KR')
                        print('▶ 통화내역 : {}'.format(self.text))
                    except:
                        None             
            if self.export_cnt == 1:
                if os.path.exists(file_path):
                    os.remove(file_path)
                    
        except: 
            print('Error')
            
    def sentiment_predict(self):
        self.text = re.sub("[^ㄱ-ㅎㅏ-ㅣ가-힣 ]", "", self.text)
        self.text = self.okt.morphs(self.text, stem=True)
        self.text = [word for word in self.text if not word in self.stopwords]
        encoded = self.tokenizer.texts_to_sequences([self.text])
        pad_new = pad_sequences(encoded, maxlen=800)
        score = float(self.loaded_model.predict(pad_new))
        
        
        
        if score < 0.4:
            print("해당 음성은 보이스피싱일 가능성이 낮습니다")
        
        
        elif score < 0.6:
            print("[의심] 해당 음성은 {}% 확률로 보이스피싱일 가능성이 있습니다. ".format(score * 100))
            score1 = float(self.type1_model.predict(pad_new))
            score2 = float(self.type2_model.predict(pad_new))
            
            if score1 > score2:
                print("[의심] 대출사기형 보이스피싱으로 분류됩니다.")
                text = "[의심] 대출사기형 보이스피싱으로 분류됩니다."
            else:
                print("[의심] 기관사칭형 보이스피싱으로 분류됩니다.")
                text = "[의심] 기관사칭형 보이스피싱으로 분류됩니다."
       
        else:
            print("[경고] 해당 음성은 {}% 확률로 보이스피싱일 가능성이 있습니다. ".format(score * 100))
            score1 = float(self.type1_model.predict(pad_new))
            score2 = float(self.type2_model.predict(pad_new))
            
            if score1 > score2:
                print("[경고] 대출사기형 보이스피싱으로 분류됩니다.")
                text = "[경고] 대출사기형 보이스피싱으로 분류됩니다."
            else:
                print("[경고] 기관사칭형 보이스피싱으로 분류됩니다.")
                text = "[경고] 기관사칭형 보이스피싱으로 분류됩니다."
            
        
        return text     
    def result(self,file_path):
        self.text = ''
        self.to_wav(file_path)
        self.recognize(file_path)
        res = self.sentiment_predict()
        return res