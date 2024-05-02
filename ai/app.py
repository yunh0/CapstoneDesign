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

# Flask 애플리케이션 생성
app = Flask(__name__)

# 파일 경로 저장을 위한 전역 변수
file_path = None


# 파일 경로를 받아서 벡터스토어에 저장하는 함수
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

        # 파일 경로가 없으면 오류 메시지 반환
        if file_path is None:
            return jsonify({'response': '파일이 업로드되지 않았습니다.'})

        # 질문에 대한 답변 생성
        response = answer_question(question, file_path)
        response_data = {"status": "success", "message": response}
        # 답변 반환
        return jsonify(response_data), 200
    except Exception as e:
        # 오류가 발생하면 오류 응답을 반환합니다.
        error_data = {"status": "error", "message": str(e)}
        return jsonify(error_data), 500


def answer_question(question, file_path):
    if file_path is None:
        return "파일 경로가 잘못되었습니다."

    # 벡터 스토어에 저장하고 반환
    vectorstore = store_vectors(file_path)
    if vectorstore is None:
        return "파일을 로드하는 동안 오류가 발생했습니다."

    # LLM 에이전트가 사용할 수 있도록 retriever 라는 툴로 만들기
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


# 파일 경로를 받아서 벡터스토어에 저장하는 함수
def store_vectors(file_path):
    if file_path is None:
        return None

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

    vectorstore.persist()
    print(vectorstore._collection.count(), "documents in collection saved.")

    return vectorstore  # 생성된 vectorstore 반환


# 애플리케이션 실행
if __name__ == '__main__':
    # 초기 설정
    
    llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0)

    # 애플리케이션 실행
    app.run(debug=True)

