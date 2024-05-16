import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
import tensorflow as tf
from tensorflow.keras.models import Model, load_model
from tensorflow.keras import preprocessing
import sys

# 의도 분류 모델
class IntentModel:
    def __init__(self, model_name, preprocess):
        # 의도 클래스별 레이블
        self.labels = {0: "보험 가입", 1: "보험 환급", 2: "보험 먼가", 3: "보험금", 4: "보험 해지", 5: "특별 약관", 6: "보험 기간", 7: "보험 보장",
                       8: "보험 청구", 9: "보험 연체", 10: "보험 내용", 11: "보험 갱신", 12: "보험 수령", 13: "보험 계약", 14: "보험 서류", 15: "보험 문의", 16: "보험 납부"}

        # 의도 분류 모델 불러오기
        self.model = load_model(model_name, custom_objects={'softmax_v2': tf.nn.softmax})

        # 챗봇 Preprocess 객체
        self.p = preprocess

    # 의도 클래스 예측
    def predict_class(self, query):
        # 형태소 분석
        pos = self.p.pos(query)

        # 문장 내 키워드 추출(불용어 제거)
        keywords = self.p.get_keywords(pos, without_tag=True)
        sequences = [self.p.get_wordidx_sequence(keywords)]

        sys.path.append('/Users/leedayoung/Desktop/캡스톤 디자인/CapstoneDesign/ai/config')
        from GlobalParams import MAX_SEQ_LEN

        # 패딩 처리
        padded_seqs = preprocessing.sequence.pad_sequences(sequences, maxlen=MAX_SEQ_LEN, padding='post')

        predict = self.model.predict(padded_seqs)
        predict_class = tf.math.argmax(predict, axis=1)
        return predict_class.numpy()[0]