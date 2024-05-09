import sys
sys.path.append('C:\\github\\CapstoneDesign\\ai\\utils')
from Preprocess import Preprocess

# 전처리 객체 생성
p = Preprocess(word2index_dic='../train_tools/dict/chatbot_dict.bin',
                userdic='../utils/user_dic.tsv')

# 원문
query = input()

# 의도 파악
sys.path.append('C:\\github\\CapstoneDesign\\ai\\models\\intent')
from IntentModel import IntentModel
intent = IntentModel(model_name='../models/intent/intent_model2.keras', preprocess=p)
predict = intent.predict_class(query)
intent_name = intent.labels[predict]

print("질문 : ", query)
print("=" * 40)
print("의도 파악 : ", intent_name)
print("=" * 40)
