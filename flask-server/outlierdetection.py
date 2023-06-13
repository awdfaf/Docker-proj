from sklearn.preprocessing import StandardScaler
import os
import pandas as pd
from sklearn.ensemble import IsolationForest


def detect(bank) :
    
    ## IsolationForest 모델 훈련시키기
    if_model = IsolationForest(contamination=0.0224) # 데이터셋에 따라 contamination값을 설정해주세요.add()

    
    if bank == "kakaobank" :
        df = pd.read_excel("./Transaction/transaction_df.xlsx")
        # 모델 학습
        if_model.fit(df)
        
        test_df = pd.read_excel("./testfile/test_df.xlsx")
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
    
    elif bank == "국민은행" :
        pass
        
    
    elif bank == "hanabank" :
        df = pd.read_excel("./Transaction/hana_전처리된_0613_train.xlsx")
        # 모델 학습
        if_model.fit(df)
        
        test_df = pd.read_excel("./testfile/hana_전처리된_0613_test.xlsx")
        test_origin_df = pd.read_excel("./testfile/hana_card_원본_df.xlsx")
        
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