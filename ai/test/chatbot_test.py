import sys
sys.path.append('/Users/leedayoung/Desktop/캡스톤 디자인/CapstoneDesign/ai/utils')
from Preprocess import Preprocess

# 전처리 객체 생성
p = Preprocess(word2index_dic='/Users/leedayoung/Desktop/캡스톤 디자인/CapstoneDesign/ai/train_tools/dict/chatbot_dict.bin',
                userdic='/Users/leedayoung/Desktop/캡스톤 디자인/CapstoneDesign/ai/utils/user_dic.tsv')

# 원문
query = input()

# 의도 파악
sys.path.append('C:\\Users\\asce3\\IdeaProjects\\ai\\models\\intent')
from IntentModel import IntentModel
intent = IntentModel(model_name='/Users/leedayoung/Desktop/캡스톤 디자인/CapstoneDesign/ai/models/intent/intent_model2.keras', preprocess=p)
predict = intent.predict_class(query)
intent_name = intent.labels[predict]

print("질문 : ", query)
print("=" * 40)
print("의도 파악 : ", intent_name)
print("=" * 40)
