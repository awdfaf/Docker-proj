import pandas as pd
import sys
from collections import Counter
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

from nltk.tokenize import word_tokenize
from konlpy.tag import Okt
from konlpy.tag import Komoran
### 한국어는 형태소 분석기를 사용
okt = Okt()

class Sms:
    def __init__(self):
        self.sms_data_sorted1=pd.read_csv('./phishing/sms_data_sorted1.csv')
        self.smishing_addresses = pd.read_csv('./phishing/sms_ip(최종).csv')
        self.fraud_ip_addresses = self.smishing_addresses['IP'].tolist()
        self.fraud_urls = self.smishing_addresses['URL'].tolist()
        self.komoran = Komoran()
        self.docs = self.sms_data_sorted1.text
        self.result = list(map(self.komoran.nouns, self.docs))
        # word_list
        self.words = [word for sublist in self.result for word in sublist]
        # Counter로 단어 나타난 빈도 계산
        self.word_counts = Counter(self.words)
        # 단어 나타난 빈도가 내린차순으로 다시 배열
        # sorted_word_counts = word_counts.most_common()
        # 단어수 및 단어마다 가중치 계산
        self.total_count = sum(self.word_counts.values())  # 총 단어수
        # word_frequencies읽어들이기
        self.word_frequencies = pd.read_csv('./phishing/word_frequencies(가중치)1.csv')

        # high_frequency_words읽어들이기
        # high_frequency_words가장 많이 나타난 단어 300개
        self.high_frequency_words = self.word_frequencies['Word'].tolist()[:170]
        # 스미싱문자 중 95%이상인 키워드 수집및 추가
        self.keywords = ["햇살론", "citi bank", "부채통합", "17등급", "높은금리",
                    "돌려막기", "자격", "친애", "악성", "불입금"
                    , "허덕", "금융권", "자체 등급", "정직", "이글"
                    , "홍보", "당사", " 손해", "기존한도", "자격기준"
                    , "환승론", "재무상태", "심사기준", "부채", "다중채무"
                    , "KISA", "답장", "카카오톡", "균등방식", "월불입금액"
                    , "목록", "최고한도", "아이디", "프리랜서", "신청방법"
                    , "3금융", "4금융", "터치", "주부", "상관없이"
                    , "고금리", "절감", "상담서비스", "가상조회", "시중은행권"
                    , "시중은행", "과다", "기대출", "원리금", "채무"
                    , "낮은신용자", "악성대출", "월불입금", "8등급", "카드값"
                    , "무담보", "신용조회", "자체등급", "연소득"
                    , "배드뱅크", "부채통합상품", "접수자", "최근부결자", "다중채무자"
                    , "통합상품", "이자만", "전환가능", "가상"
                    , "빠른신청", "직장인전용", "직장인", "신용상품한도", "리스트"
                    , "채무통합", "전환상품", "전환상품한도", "연봉", "홀씨한도"
                    , "부채과다", "당행상품", "두번 다시", "조치를 취해", "친구추가"
                    , "상담신청", "건수", "상품특징", "한국이지론"
                    , "연봉대비", "당행 거래", "금융사", "파격", "저신용자", "등급한도", "진행가능","여신영업부","전환대출","새희망홀씨"
                    ,"홀씨","신용자","한 번에","은행권","기존대출","신용관리","추가자금","가이드","정부지원"
                    ,"수단과 방법","낮춰","금리변동","대기업","개인사업장","사대보험","300%"
                    ,"DTI","잘못된","월급","21배","타사","원금이","카드론","현금서비스","동원","통합대출"
                    ,"잦은","추가진행","6개월간","연체사실","상식","지식","최소한","금전적","원외","반업"
                    ,"금리체계", "원리금균등", "원리금 균등", "직군", "신용 등급"
                    ,"13등급", "원금이자", "읽어", "신청 방법", "가조회", "회신"
                    ,"외감", "이자 절감", "건전한", "부채금액", "등급 상승"
                    ,"자격 기준", "지장", "추가 자금", "현혹", "수탁","5년분할","요신","요신용","신용상"
                , "핵심", "불입액", "정부지원조건","+","%","↑","답장","조","희망","당첨","주식","증권"]
        self.high_frequency_words += self.keywords

    def detect_fraud_sms(self, text):

        nouns = self.komoran.nouns(text)

        # 문자중 high_frequency_words 나타난 횟수
        word_counts = Counter(nouns)
        total_count = sum(word_counts.values())

        # total_count가 0이 아닌 경우에만 word_repetition 계산
        if total_count != 0:
            word_repetition = sum(word_counts[word] / total_count for word in self.high_frequency_words)
        else:
            word_repetition = 0

        # fraud_ip있는지 판단하기
        has_fraud_ip = any(ip in text for ip in self.fraud_ip_addresses)

        # fraud_url있는지 판단하기
        has_fraud_url = any(url in text for url in self.fraud_urls)

        # 결과판단
        if word_repetition >= 0.6 or has_fraud_ip or has_fraud_url:
            return "경고：해당 문자 내용은 사기와 관련된 것일 수 있습니다!"
        elif word_repetition >= 0.4 or has_fraud_ip or has_fraud_url:
            return "의심：해당 문자 내용은 사기 위험이 있을 수 있습니다!"
        elif word_repetition >= 0.2 or has_fraud_ip or has_fraud_url:
            return "안전：해당 문자 내용은 사기 위험 비교적 적습니다."
        else:
            return "안전：해당 문자 내용에서 사기 관련 정보가 발견되지 않습니다."