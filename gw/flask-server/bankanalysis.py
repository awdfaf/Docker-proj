from sklearn.preprocessing import StandardScaler
import os
import pandas as pd


def bankanalysis(bank): 

        
    total_df = None
    
    # 카드사별로 전처리 진행 
    if bank == "하나은행":
        # 파일 불러오기
        # df=pd.read_excel("C:/bankbibimbap/data/체크카드이용내역.xlsx")
        # 특정 열만 추출
        total_df=df[["거래일시", "구분",  "분야", "출금액"]]
        # 열 이름 다시 부여
        total_df.columns=["거래일시", "거래구분", "업명", "출금액"]
        # 범위형 변수 전처리
        df=pd.get_dummies(total_df, columns = ['거래구분', '업명'])
        # 출금액 전처리
        df["출금액"]=df["출금액"].str.replace(",", '')
        total_df["출금액"]=total_df["출금액"].str.replace(",", '')
        df["출금액"]=df["출금액"].astype("int")
        total_df["출금액"]=total_df["출금액"].astype("int")
        df['출금액'] = StandardScaler().fit_transform(df['출금액'].values.reshape(-1, 1))
        # 거래일시 열 추가
        total_df['거래일시'] = pd.to_datetime(total_df['거래일시'], format='%Y-%m-%d %H:%M:%S')
        # 출금액 0 제외 필터링 지정
        condition = total_df['출금액'] != 0
        total_df = total_df.loc[condition]
        
        df = df.drop(["거래일시"], axis=1)    
    
    elif bank == "kb":
        # 파일 불러오기
        filename = 'kb.xlsx'  # 파일명 변수에 저장
        file_path = './Transaction/' + filename  # 파일 경로 변수에 저장
        df = pd.read_excel(file_path)  # 파일 경로 변수를 사용하여 엑셀 파일 읽기
        # 특정 열만 추출
        total_df=df[["이용일시", "분야", "이용금액"]]
		# 열 이름 다시 부여
        total_df.columns=["거래일시", "업명", "출금액"]
        # 범위형 변수 전처리
        df=pd.get_dummies(total_df, columns = ['업명'])
        # 출금액 전처리
        df["출금액"]=df["출금액"].str.replace(",", '')
        total_df["출금액"]=total_df["출금액"].str.replace(",", '')
        df["출금액"]=df["출금액"].astype("int")
        total_df["출금액"]=total_df["출금액"].astype("int")
        df['출금액'] = StandardScaler().fit_transform(df['출금액'].values.reshape(-1, 1))
		# 거래일시 열 추가
        total_df['거래일시'] = pd.to_datetime(total_df['거래일시'], format='%Y-%m-%d\n%H:%M')  
	
        df = df.drop(["거래일시"], axis=1)
    
    elif bank == "kakaobank":
        # 파일 불러오기
        filename = 'kakaobank_card.xlsx'  # 파일명 변수에 저장
        file_path = './Transaction/' + filename  # 파일 경로 변수에 저장
        df = pd.read_excel(file_path)  # 파일 경로 변수를 사용하여 엑셀 파일 읽기
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
        total_df['거래일시'] = pd.to_datetime(total_df['거래일시'], format='%Y-%m-%d %H:%M:%S')
		
        # df['출금액'] = df['출금액'] * -1
        total_df['출금액'] = total_df['출금액'] * -1
        df['출금액'] = StandardScaler().fit_transform(df['출금액'].values.reshape(-1, 1))
		
        df = df.drop(["거래일시"], axis=1)
        # print(df)
        
    else :
        print("해당 은행사는 아직 분석이 불가합니다.")
    
    

    
    if df is not None and total_df is not None and not df.empty and not total_df.empty:
        data = {
            'bank': bank,
            'filename': filename,
            'df': df.to_json(orient='records'),
            'total_df': total_df.to_json(orient='records'),
        }
        return data
    else:
        return "Some variables are None or empty DataFrames"