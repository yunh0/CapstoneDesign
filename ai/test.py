from flask import Flask, request, jsonify
import os
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_openai import ChatOpenAI
from langchain.agents.agent_toolkits import create_retriever_tool
from langchain.agents.openai_functions_agent.base import OpenAIFunctionsAgent
from langchain.schema.messages import SystemMessage
from langchain.prompts import MessagesPlaceholder
from langchain.agents import AgentExecutor

import sys
sys.path.append('C:\\Users\\user\\IdeaProjects\\CapstoneDesign2\\ai\\utils')
from Preprocess import Preprocess
# 전처리 객체 생성
p = Preprocess(word2index_dic='C:\\Users\\user\\IdeaProjects\\CapstoneDesign2\\ai\\train_tools\\dict\\chatbot_dict.bin',
                userdic='C:\\Users\\user\\IdeaProjects\\CapstoneDesign2\\ai\\utils\\user_dic.tsv')


# Flask 애플리케이션 생성
app = Flask(__name__)
os.environ["OPENAI_API_KEY"] = ""

# 파일 경로 및 벡터스토어를 저장할 전역 변수
file_path = None
vectorstores = {}


# 파일 경로를 받아서 벡터스토어를 불러오는 함수
def load_vectorstore(file_path, cache={}):
    # 이미 저장된 벡터스토어가 있는지 확인하고 있다면 바로 반환
    if file_path in cache:
        print(f"{file_path} 벡터스토어 이미 존재. 반환합니다.")
        return cache[file_path]

    # 파일로부터 문서 로드
    loaders = [
        PyPDFLoader(file_path),
    ]

    docs = []
    for loader in loaders:
        docs.extend(loader.load())

    # 문서를 청크로 분할
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=0,
    )
    splits = text_splitter.split_documents(docs)

    # OpenAI 임베딩 모델을 사용하여 텍스트를 벡터로 변환하고, 이를 Chroma 벡터 저장소에 저장
    embedding = OpenAIEmbeddings()
    vectorstore = Chroma.from_documents(documents=splits, embedding=embedding)

    # 생성된 벡터스토어 캐시에 저장
    cache[file_path] = vectorstore

    print(f"{file_path} 벡터스토어 생성 및 캐시에 저장 완료.")
    return vectorstore



# 40개의 파일을 미리 임베딩하여 벡터스토어에 저장하는 함수
def pre_load_vectorstores():
    global vectorstores

    # 40개의 파일 경로
    file_paths = [
        "https://storage.googleapis.com/capstone_1971166_bucket/%EB%AC%B4%EB%B0%B0%EB%8B%B9%20%ED%94%84%EB%A1%9C%EB%AF%B8%EB%9D%BC%EC%9D%B4%ED%94%84%20New%20I%60mOK%20%EC%95%94%EB%B3%B4%ED%97%982404.pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%EB%AC%B4%EB%B0%B0%EB%8B%B9%20%ED%94%84%EB%A1%9C%EB%AF%B8%EB%9D%BC%EC%9D%B4%ED%94%84%20New%20I%60mOK%20%EC%95%94%EB%B3%B4%ED%97%982404(TM).pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%EB%AC%B4%EB%B0%B0%EB%8B%B9%20%ED%94%84%EB%A1%9C%EB%AF%B8%EB%9D%BC%EC%9D%B4%ED%94%84%20%EC%B0%B8%EC%A2%8B%EC%9D%80%EC%95%94%EB%B3%B4%ED%97%982404(CM).pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%ED%95%9C%ED%99%94%EC%83%9D%EB%AA%85%20%EC%8B%9C%EA%B7%B8%EB%8B%88%EC%B2%98%20%EC%95%94%EB%B3%B4%ED%97%98%203.0%20%EB%AC%B4%EB%B0%B0%EB%8B%B9.pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%ED%95%9C%ED%99%94%EC%83%9D%EB%AA%85%20e%EC%8B%9C%EA%B7%B8%EB%8B%88%EC%B2%98%EC%95%94%EB%B3%B4%ED%97%98%20%EB%AC%B4%EB%B0%B0%EB%8B%B9.pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%ED%95%9C%ED%99%94%EC%83%9D%EB%AA%85%20e%EC%95%94%EB%B3%B4%ED%97%98(%EB%B9%84%EA%B0%B1%EC%8B%A0%ED%98%95)%20%EB%AC%B4%EB%B0%B0%EB%8B%B9.pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%EB%AC%B4%EB%B0%B0%EB%8B%B9%ED%98%84%EB%8C%80%ED%95%B4%EC%83%81%EB%8B%A4%EC%9D%B4%EB%A0%89%ED%8A%B8%EA%B3%84%EC%86%8D%EB%B0%9B%EB%8A%94%EC%95%94%EB%B3%B4%ED%97%98(Hi2404).pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%EB%AC%B4%EB%B0%B0%EB%8B%B9%ED%98%84%EB%8C%80%ED%95%B4%EC%83%81%EB%91%90%EB%B0%B0%EB%B0%9B%EB%8A%94%EC%95%94%EB%B3%B4%ED%97%98(%EC%84%B8%EB%A7%8C%EA%B8%B0%ED%98%95)(Hi2404)%201%2C2%EC%A2%85.pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%EB%AC%B4%EB%B0%B0%EB%8B%B9%ED%98%84%EB%8C%80%ED%95%B4%EC%83%81%EB%91%90%EB%B0%B0%EB%B0%9B%EB%8A%94%EC%95%94%EB%B3%B4%ED%97%98(%EC%97%B0%EB%A7%8C%EA%B8%B0%EA%B0%B1%EC%8B%A0%ED%98%95)(Hi2404)%203%EC%A2%85.pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%ED%94%84%EB%A1%9C%EB%AF%B8%20%EC%A3%BC%ED%83%9D%ED%99%94%EC%9E%AC%EB%B3%B4%ED%97%98%E2%85%A1.pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%ED%94%84%EB%A1%9C%EB%AF%B8%20%EC%A3%BC%ED%83%9D%ED%99%94%EC%9E%AC%EB%B3%B4%ED%97%98.pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%ED%94%84%EB%A1%9C%EB%AF%B8%20%EC%A3%BC%ED%83%9D%ED%99%94%EC%9E%AC%EB%B3%B4%ED%97%98(%EB%B0%A9%EC%B9%B4).pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%EB%AC%B4%EB%B0%B0%EB%8B%B9%20%EB%A9%94%EB%A6%AC%EC%B8%A0%20%EC%9A%B4%EC%A0%84%EC%9E%90%20%EC%83%81%ED%95%B4%20%EC%A2%85%ED%95%A9%EB%B3%B4%ED%97%982404(%ED%99%94%EC%9E%AC%EB%B3%B4%ED%97%98).pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%EC%97%B0%EA%B8%88%EC%A0%80%EC%B6%95%EC%86%90%ED%95%B4%EB%B3%B4%ED%97%98%20%EC%8A%A4%EB%A7%88%ED%8A%B8%EA%B3%84%EC%95%BD%EC%9D%B4%EC%A0%84%EC%97%B0%EA%B8%88%EB%B3%B4%ED%97%982404.pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%EC%97%B0%EA%B8%88%EC%A0%80%EC%B6%95%EC%86%90%ED%95%B4%EB%B3%B4%ED%97%98%20%EC%9C%A0%EB%B0%B0%EB%8B%B9%20%EB%8B%A4%EC%9D%B4%EB%A0%89%ED%8A%B8%20%EC%97%B0%EA%B8%88%EB%B3%B4%ED%97%982404(CM).pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%EC%97%B0%EA%B8%88%EC%A0%80%EC%B6%95%EC%86%90%ED%95%B4%EB%B3%B4%ED%97%98%20%EC%8A%A4%EB%A7%88%ED%8A%B8%EC%97%B0%EA%B8%88%EB%B3%B4%ED%97%982404.pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%ED%95%9C%ED%99%94%EC%83%9D%EB%AA%85%20%EC%97%B0%EA%B8%88%EC%A0%80%EC%B6%95%20%ED%95%98%EC%9D%B4%EB%93%9C%EB%A6%BC%EC%97%B0%EA%B8%88%EB%B3%B4%ED%97%98.pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%ED%95%9C%ED%99%94%EC%83%9D%EB%AA%85%20%EB%82%B4%EA%B2%8C%EB%A7%9E%EB%8A%94%20%EC%97%B0%EA%B8%88%EB%B3%B4%ED%97%98%20%EB%AC%B4%EB%B0%B0%EB%8B%B9.pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%ED%95%9C%ED%99%94%EC%83%9D%EB%AA%85%20%EC%8A%A4%EB%A7%88%ED%8A%B8%ED%95%98%EC%9D%B4%EB%B8%8C%EB%A6%AC%EB%93%9C%EC%97%B0%EA%B8%88%EB%B3%B4%ED%97%98%20%EB%AC%B4%EB%B0%B0%EB%8B%B9.pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%EC%97%B0%EA%B8%88%EC%A0%80%EC%B6%95%EC%86%90%ED%95%B4%EB%B3%B4%ED%97%98%ED%98%84%EB%8C%80%ED%95%B4%EC%83%81%EB%8B%A4%EC%9D%B4%EB%A0%89%ED%8A%B8%EC%97%B0%EA%B8%88%EB%B3%B4%ED%97%98(Hi2404).pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%EC%97%B0%EA%B8%88%EC%A0%80%EC%B6%95%EC%86%90%ED%95%B4%EB%B3%B4%ED%97%98%ED%98%84%EB%8C%80%ED%95%B4%EC%83%81%EB%8B%A4%EC%9D%B4%EB%A0%89%ED%8A%B8%ED%95%98%EC%9D%B4%EB%A1%9C%EC%97%B0%EA%B8%88%EB%B3%B4%ED%97%98(Hi2404).pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%EC%97%B0%EA%B8%88%EC%A0%80%EC%B6%95%EC%86%90%ED%95%B4%EB%B3%B4%ED%97%98%ED%98%84%EB%8C%80%ED%95%B4%EC%83%81%EB%85%B8%ED%9B%84%EC%9B%B0%EC%8A%A4%EB%B3%B4%ED%97%98(Hi2404).pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%EB%AC%B4%EB%B0%B0%EB%8B%B9%20%ED%94%84%EB%A1%9C%EB%AF%B8%EB%9D%BC%EC%9D%B4%ED%94%84%20%ED%8E%AB%EB%B8%94%EB%A6%AC%20%EB%B0%98%EB%A0%A4%EA%B2%AC%EB%B3%B4%ED%97%982404.pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%EB%AC%B4%EB%B0%B0%EB%8B%B9%20%ED%94%84%EB%A1%9C%EB%AF%B8%EB%9D%BC%EC%9D%B4%ED%94%84%20%ED%8E%AB%EB%B8%94%EB%A6%AC%20%EB%B0%98%EB%A0%A4%EB%AC%98%EB%B3%B4%ED%97%982404.pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%EB%AC%B4%EB%B0%B0%EB%8B%B9%20%ED%94%84%EB%A1%9C%EB%AF%B8%EB%9D%BC%EC%9D%B4%ED%94%84%20%EB%8B%A4%EC%9D%B4%EB%A0%89%ED%8A%B8%20%ED%8E%AB%EB%B8%94%EB%A6%AC%20%EB%B0%98%EB%A0%A4%EA%B2%AC%EB%B3%B4%ED%97%982404(CM).pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%EB%B0%98%EB%A0%A4%EB%8F%99%EB%AC%BC%20%EC%8B%A4%EC%86%90%EC%9D%98%EB%A3%8C%EB%B9%84%EB%B3%B4%ED%97%98%20(%EB%AC%B4)%ED%8E%AB%ED%8D%BC%EB%AF%BC%ED%8A%B8%20Puppy%26Family%EB%B3%B4%ED%97%982404.pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%EB%B0%98%EB%A0%A4%EB%8F%99%EB%AC%BC%20%EC%8B%A4%EC%86%90%EC%9D%98%EB%A3%8C%EB%B9%84%EB%B3%B4%ED%97%98%20(%EB%AC%B4)%ED%8E%AB%ED%8D%BC%EB%AF%BC%ED%8A%B8%20Cat%26Family%EB%B3%B4%ED%97%982404.pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%ED%95%98%EC%9D%B4%ED%8E%AB%EB%B3%B4%ED%97%98(%EA%B5%AC%20%ED%95%98%EC%9D%B4%EB%B0%98%EB%A0%A4%EB%8F%99%EB%AC%BC%EB%B3%B4%ED%97%98).pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%EB%AC%B4%EB%B0%B0%EB%8B%B9%ED%98%84%EB%8C%80%ED%95%B4%EC%83%81%EA%B5%BF%EC%95%A4%EA%B5%BF%EC%9A%B0%EB%A6%AC%ED%8E%AB%EB%B3%B4%ED%97%98(Hi2404).pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%EB%AC%B4%EB%B0%B0%EB%8B%B9%ED%98%84%EB%8C%80%ED%95%B4%EC%83%81%EB%8B%A4%EC%9D%B4%EB%A0%89%ED%8A%B8%EA%B5%BF%EC%95%A4%EA%B5%BF%EC%9A%B0%EB%A6%AC%ED%8E%AB%EB%B3%B4%ED%97%98(Hi2404).pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%ED%94%84%EB%A1%9C%EB%AF%B8%EC%B9%B4%EB%8B%A4%EC%9D%B4%EB%A0%89%ED%8A%B8%EA%B0%9C%EC%9D%B8%EC%9A%A9%EC%9E%90%EB%8F%99%EC%B0%A8%EB%B3%B4%ED%97%98.pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%ED%94%84%EB%A1%9C%EB%AF%B8%EC%B9%B4%EA%B3%B0%EB%91%90%EB%A6%AC%EC%9E%90%EB%8F%99%EC%B0%A8%EB%B3%B4%ED%97%98.pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%ED%94%84%EB%A1%9C%EB%AF%B8%EC%B9%B4%EB%8B%A4%EC%9D%B4%EB%A0%89%ED%8A%B8(TM)%EA%B0%9C%EC%9D%B8%EC%9A%A9%EC%9E%90%EB%8F%99%EC%B0%A8%EB%B3%B4%ED%97%98.pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%EB%AC%B4%EB%B0%B0%EB%8B%B9%20%EB%A9%94%EB%A6%AC%EC%B8%A0%20%EC%9A%B4%EC%A0%84%EC%9E%90%20%EC%83%81%ED%95%B4%20%EC%A2%85%ED%95%A9%EB%B3%B4%ED%97%982404.pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%EB%A9%94%EB%A6%AC%EC%B8%A0%EB%8B%A4%EC%9D%B4%EB%A0%89%ED%8A%B8%20%EC%9E%90%EB%8F%99%EC%B0%A8%EB%B3%B4%ED%97%98(%EA%B0%9C%EC%9D%B8%EC%9A%A9).pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/%EB%A9%94%EB%A6%AC%EC%B8%A0%EB%8B%A4%EC%9D%B4%EB%A0%89%ED%8A%B8%20%EC%9E%90%EB%8F%99%EC%B0%A8%EB%B3%B4%ED%97%98(%EC%97%85%EB%AC%B4%EC%9A%A9).pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/Hicar%20%EA%B0%9C%EC%9D%B8%EC%9A%A9%EC%9E%90%EB%8F%99%EC%B0%A8%EB%B3%B4%ED%97%98.pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/Hicar%20%EB%8B%A4%EC%9D%B4%EB%A0%89%ED%8A%B8%20%EA%B0%9C%EC%9D%B8%EC%9A%A9%EC%9E%90%EB%8F%99%EC%B0%A8%EB%B3%B4%ED%97%98.pdf",
        # "https://storage.googleapis.com/capstone_1971166_bucket/Hicar%20%EC%98%81%EC%97%85%EC%9A%A9%EC%9E%90%EB%8F%99%EC%B0%A8%EB%B3%B4%ED%97%98.pdf",
        ]

    # 파일 경로들에 대한 벡터스토어 미리 생성
    for file_path in file_paths:
        if file_path not in vectorstores:
            load_vectorstore(file_path)

# 파일 경로를 받아서 벡터스토어에 저장하는 함수를 이용하여 벡터스토어를 불러오는 코드 수정
def answer_question(question, file_path):
    if file_path is None:
        return "파일 경로가 잘못되었습니다."

    # 벡터 스토어 불러오기
    vectorstore = load_vectorstore(file_path)
    if vectorstore is None:
        return "파일을 로드하는 동안 오류가 발생했습니다."

    # LLM 에이전트 생성(gpt-4o모델 사용)
    llm = ChatOpenAI(model_name="gpt-4o", temperature=0)

    # LLM에이전트가 사용할 수 있도록 retriever 라는 툴로 만들기
    retriever = vectorstore.as_retriever()

    # LLM에이전트가 만약 유저가 내가 업로드한 문서에 관련된 질문을 하면 이 tool을 사용해서 검색을 하게 됨
    tool = create_retriever_tool(
        retriever,
        "customer_service",
        "Searches and returns documents regarding the customer service guide.",
    )
    tools = [tool]

    # 대화 내용 기억할 수 있는 메모리 부여
    memory_key = "history"
    from langchain.agents.openai_functions_agent.agent_token_buffer_memory import AgentTokenBufferMemory
    memory = AgentTokenBufferMemory(memory_key=memory_key, llm=llm)

    # 에이전트 만들기
    system_message = SystemMessage(
        content=(
            "You are a nice customer Insurance service agent."
            "Do your best to answer the questions."
            "Feel free to use any tools available to look up "
            "relevant information, only if necessary"
            "Please do not generate incorrect answers to questions that are not related to insurance terms and conditions"
            "If you don't know the answer, just say that you don't know. Don't try to make up an answer."
            "Make sure to answer in Korean."
        )
    )
    prompt = OpenAIFunctionsAgent.create_prompt(
        system_message=system_message,
        extra_prompt_messages=[MessagesPlaceholder(variable_name=memory_key)],
    )
    agent = OpenAIFunctionsAgent(llm=llm, tools=tools, prompt=prompt)

    # 에이전트 실행
    agent_executor = AgentExecutor(
        agent=agent,
        tools=tools,
        memory=memory,
        verbose=True,
        return_intermediate_steps=True,
    )

    # 위에서 작성한 agent_executor 사용하여 질문에 대한 답변 생성
    result = agent_executor({"input": question})
    response = result.get('output', None)
    if response is None:
        return "챗봇이 답변을 생성하지 못했습니다."
    else:
        return response

# 파일 경로를 받는 API 엔드포인트
@app.route('/api/receive', methods=['POST'])
def receive_file():
    global file_path
    # 파일 경로 받기
    file_path = request.json.get('filePath')
    print(file_path)
    # 응답 반환
    return jsonify({'message': 'File received successfully.'})

# 사용자가 질문을 보내면 이 함수가 호출됨
@app.route('/api/message/receive', methods=['POST'])
def receive_message():
    try:
        global file_path
        # JSON 형식으로 데이터 받기
        data = request.get_json()

        # 질문 받기
        question = data.get('content')

        prediction = question_prediction(question)

        # 파일 경로가 없으면 오류 메시지 반환
        if file_path is None:
            return jsonify({'response': '파일이 업로드되지 않았습니다.'})

        # 질문에 대한 답변 생성
        response = answer_question(question, file_path)
        response_data = {"status": "success", "message": response, "prediction": prediction}
        # 답변 반환
        return jsonify(response_data), 200

    except Exception as e:
        # 오류가 발생하면 오류 응답을 반환합니다.
        error_data = {"status": "error", "message": str(e)}
        return jsonify(error_data), 500

def question_prediction(question):
    global p

    # 원문
    query = question

    # 의도 파악
    sys.path.append('C:\\Users\\user\\IdeaProjects\\CapstoneDesign2\\ai\\models\\intent')
    from IntentModel import IntentModel
    intent = IntentModel(model_name='C:\\Users\\user\\IdeaProjects\\CapstoneDesign2\\ai\\models\\intent\\intent_model.keras', preprocess=p)
    predict = intent.predict_class(query)
    intent_name = intent.labels[predict]

    print("질문 : ", query)
    print("=" * 40)
    print("의도 파악 : ", intent_name)
    print("=" * 40)
    return intent_name

# 애플리케이션 실행 시 40개의 파일을 미리 임베딩하여 벡터스토어에 저장

# 애플리케이션 실행
if __name__ == '__main__':
    pre_load_vectorstores()
    # 애플리케이션 실행
    app.run(debug=True)



