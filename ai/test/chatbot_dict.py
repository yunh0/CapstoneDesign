import sys
sys.path.append('C:\\github\\CapstoneDesign\\ai\\utils')
from Preprocess import Preprocess
from flask import Flask, request, jsonify

app = Flask(__name__)

# 전처리 객체 생성
p = Preprocess(word2index_dic='../train_tools/dict/chatbot_dict.bin',
                userdic='../utils/user_dic.tsv')

@app.route('/api/question', methods=['POST'])
def receive_question():
    question = request.json.get('question')
    print(question)
    question_prediction(question)
    return jsonify({'question': 'question received successfully.'})

def question_prediction(question):
    global p

    # 원문
    query = question

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


if __name__ == '__main__':
    # 애플리케이션 실행
    app.run(debug=True)