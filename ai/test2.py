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

# Flask 애플리케이션 설정
app = Flask(__name__)

# 챗봇 설정
os.environ["OPENAI_API_KEY"] = ""
llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0)

# 문서 로드 함수
def load_document(file_path):
    loader = PyPDFLoader(file_path)
    return loader.load()

# 벡터 저장소 구성 함수
def setup_vectorstore(docs):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=0,
    )
    splits = text_splitter.split_documents(docs)

    embedding = OpenAIEmbeddings()
    vectorstore = Chroma.from_documents(documents=splits, embedding=embedding)
    vectorstore.persist()

    return vectorstore

# 검색 도구 생성 함수
def create_retrieval_tool(vectorstore):
    retriever = vectorstore.as_retriever()
    tool = create_retriever_tool(
        retriever,
        "cusomter_service",
        "Searches and returns documents regarding the customer service guide.",
    )
    return tool

# 대화 기억 구성
memory_key = "history"
from langchain.agents.openai_functions_agent.agent_token_buffer_memory import (
    AgentTokenBufferMemory,
)

memory = AgentTokenBufferMemory(memory_key=memory_key, llm=llm)

# 챗봇 설정 메시지
system_message = SystemMessage(
    content=(
        "You are a nice customer Insurance service agent. "
        "Do your best to answer the questions. "
        "Feel free to use any tools available to look up "
        "relevant information, only if necessary. "
        "Please do not generate incorrect answers to questions that are not related to insurance terms and conditions. "
        "If you don't know the answer, just say that you don't know. Don't try to make up an answer. "
        "Make sure to answer in Korean."
    )
)

# 프롬프트 설정
prompt = OpenAIFunctionsAgent.create_prompt(
    system_message=system_message,
    extra_prompt_messages=[MessagesPlaceholder(variable_name=memory_key)],
)

# 챗봇 에이전트 생성
agent = OpenAIFunctionsAgent(llm=llm, tools=[], prompt=prompt)

# 에이전트 실행기
agent_executor = AgentExecutor(
    agent=agent,
    tools=[],  # tool 추가는 동적으로 할 것이기 때문에 빈 리스트로 초기화
    memory=memory,
    verbose=True,
    return_intermediate_steps=True,
)

# 파일 경로를 받아 문서 로드하는 엔드포인트
@app.route('/api/receive', methods=['POST'])
def receive_file_path():
    if request.method == 'POST':
        data = request.json
        file_path = data.get('file_path')

        # 문서 로드
        docs = load_document(file_path)

        # 벡터 저장소 구성
        vectorstore = setup_vectorstore(docs)

        # 검색 도구 생성
        tool = create_retrieval_tool(vectorstore)

        # 챗봇 설정에 검색 도구 추가
        agent.tools.append(tool)

        return jsonify({"message": "File loaded successfully."})

# 사용자의 질문을 받아 처리하는 엔드포인트
@app.route('/api/message/receive', methods=['POST'])
def receive_question():
    if request.method == 'POST':
        data = request.json
        user_question = data.get('question')

        # 챗봇으로 질문 전달 및 응답 받기
        result = agent_executor({"input": user_question})

        # 응답 반환
        return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
