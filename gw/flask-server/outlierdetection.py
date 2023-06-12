from sklearn.preprocessing import StandardScaler
import os
import pandas as pd
from sklearn.ensemble import IsolationForest


def detect(bank) :
    
    
    if bank == "kakaobank" :
        file_path = "./Transaction/kakaobank_card.xlsx"
    elif bank == "kb" :
        file_path = "./Transaction/kb.xlsx"
    elif bank == "hanabank" :
        file_path = "./Transaction/hana_card.xlsx"
        
    # ### ------------------------------------------------------------------
    df = pd.read_excel(file_path)
    
    total_df = None
    
    # 카드사별로 전처리 진행 
    if bank == "hanabank":
        # 특정 열만 추출
        df = df[df['구분'] == '출금']
        
        # 특정 열만 추출
        total_df=df[["거래일시", "구분",  "분야", "출금액"]]
        # 열 이름 다시 부여
        total_df.columns=["거래일시", "거래구분", "업명", "출금액"]
        # 범위형 변수 전처리
        df=pd.get_dummies(total_df, columns = ['거래구분', '업명'])
        # 출금액 전처리
        df['출금액']=df['출금액'].astype("str")
        df["출금액"]=df["출금액"].str.replace(",", '').astype("int")
        df['출금액'] = StandardScaler().fit_transform(df['출금액'].values.reshape(-1, 1))
        
        total_df['출금액'] = total_df['출금액'].astype("str")
        total_df["출금액"]=total_df["출금액"].str.replace(",", '')
        # df["출금액"]=df["출금액"].astype("int")
        total_df["출금액"]=total_df["출금액"].astype("int")
        
        # 거래일시 열 추가
        total_df['거래일시'] = pd.to_datetime(total_df['거래일시'], format='%Y-%m-%d %H:%M:%S')
        # 출금액 0 제외 필터링 지정
        condition = total_df['출금액'] != 0
        total_df = total_df.loc[condition]
        
        df = df.drop(["거래일시"], axis=1)    
    
    elif bank == "kb":
        df = df[df['구분'] == '출금']
        
        # 특정 열만 추출
        total_df=df[["이용일시", "분야", "이용금액"]]
        # 열 이름 다시 부여
        total_df.columns=["거래일시", "업명", "출금액"]
        # 범위형 변수 전처리
        df=pd.get_dummies(total_df, columns = ['업명'])
        # 출금액 전처리
        df['출금액']=df['출금액'].astype("str")
        df["출금액"]=df["출금액"].str.replace(",", '').astype("int")
        df['출금액'] = StandardScaler().fit_transform(df['출금액'].values.reshape(-1, 1))
        
        total_df['출금액'] = total_df['출금액'].astype("str")
        total_df["출금액"]=total_df["출금액"].str.replace(",", '').astype("int")
        # df["출금액"]=df["출금액"].astype("int")
        # total_df["출금액"]=total_df["출금액"].astype("int")
        
        # 거래일시 열 추가
        total_df['거래일시'] = pd.to_datetime(total_df['거래일시'], format='%Y-%m-%d\n%H:%M')  

        df = df.drop(["거래일시"], axis=1)
    
    elif bank == "kakaobank":
        # 파일 불러오기
        # df = pd.read_excel('kakaobank.xlsx')
        df = df[df['구분'] == '출금']
        
        # 특정 열만 추출
        total_df=df[["거래일시","거래구분", "업명",  "거래금액"]]
        # 열 이름 다시 부여
        total_df.columns=["거래일시", "거래구분", "업명", "출금액"]
        # 범위형 변수 전처리
        df=pd.get_dummies(total_df, columns = ['거래구분', '업명'])
        # 출금액 전처리
        df['출금액']=df['출금액'].astype("str")
        df["출금액"]=df["출금액"].replace(",", '').astype("int") * -1
        # df["출금액"]=df["출금액"].astype("int")
        df['출금액'] = StandardScaler().fit_transform(df['출금액'].values.reshape(-1, 1))
        total_df['출금액'] = total_df['출금액'].astype("str")
        total_df["출금액"]=total_df["출금액"].replace(",", '')
        total_df["출금액"]=total_df["출금액"].astype("int")
        
        # 거래일시 열 추가
        total_df['거래일시'] = pd.to_datetime(total_df['거래일시'], format='%Y-%m-%d %H:%M:%S')
        
        # df['출금액'] = df['출금액'] * -1
        total_df['출금액'] = total_df['출금액'] * -1
        df['출금액'] = StandardScaler().fit_transform(df['출금액'].values.reshape(-1, 1))
        
        df = df.drop(["거래일시"], axis=1)
        # print(df)
        
    else :
        print("해당 은행사는 아직 분석이 불가합니다.")
        
    ## IsolationForest 모델 훈련시키기
    if_model = IsolationForest(contamination=0.0224) # 데이터셋에 따라 contamination값을 설정해주세요.add()
    
    ######### 전처리 과정 안거치고 바로 훈련시키기 #############
    df = pd.read_excel("./Transaction/transaction_df.xlsx")
    # 모델 학습
    if_model.fit(df)
    
    # test_df = pd.read_excel("test_임의입력_전처리후.xlsx")
    test_df = pd.read_excel("./testfile/test_df.xlsx")
    # test_origin_df = pd.read_excel("test_임의입력.xlsx")
    test_origin_df = pd.read_excel("./testfile/test_원본.xlsx")
    
    # 임의의 데이터 프레임으로 예측하고 결과 detect.html에 넘겨서 보여주기 
    # 이상치 점수 예측하기
    scores = if_model.decision_function(test_df)
    # 이상치 결과를 포함한 데이터프레임 생성
    results_df = pd.DataFrame({"이상치 예측 점수": scores})

    results_df['상태'] = results_df['이상치 예측 점수'].apply(lambda x: '이상거래' if x < 0 else '정상거래')
    # results_df
    # Concatenate test_df with results_df row-wise
    results_df = pd.concat([results_df, test_origin_df], axis=1)


        
    if df is not None and results_df is not None and not df.empty and not results_df.empty:
        df_json = df.to_json(orient='records')
        # results_df_json = results_df.to_json(orient='records')
        data = {
            'results_df' : results_df.to_dict(orient='records')
        }
        return data
        
    else:
        return "Some variables are None or empty DataFrames"