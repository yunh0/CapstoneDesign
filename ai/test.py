import os
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
from langchain.agents.agent_toolkits import create_retriever_tool
from langchain.agents.openai_functions_agent.base import OpenAIFunctionsAgent
from langchain.schema.messages import SystemMessage
from langchain.prompts import MessagesPlaceholder
from langchain.agents import AgentExecutor

# 사용자가 보낸 질문에 마우스 호버 하면(또는 각 질문 위에)
# <타 보험과 비교하기> 버튼을 눌러서 그 질문이 이 파일에 넘어와서 질문을 하도록 하기
os.environ["OPENAI_API_KEY"] = "YOUR_API_KEY"
# llm 셋업
llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0)

loaders = [
    PyPDFLoader("./file/(무)퇴직보험_약관_20130612.pdf"),
]

docs = []
for loader in loaders:
    docs.extend(loader.load())

# 문서를 청크로 분할
# chunk_size는 자르고자 하는 글자수, chunk_overlap 은 각 부분마다 겹쳐도 되는 글자 수
# Recursive Character Text Splitter 는 최대한 관련 있는 문장들을 같이 묶어서 잘라주는 기능을 한다.
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=0,
)
# docs 변수에 분할 문서를 저장
splits = text_splitter.split_documents(docs)

# OpenAI 임베딩 모델을 사용하여 텍스트를 벡터로 변환하고, 이를 Chroma 벡터 저장소에 저장
embedding = OpenAIEmbeddings()
vectorstore = Chroma.from_documents(documents=splits, embedding=embedding)

vectorstore.persist()
print(vectorstore._collection.count(), "documents in collection saved.")

# LLM 에이전트가 사용할 수 있도록 retriever 라는 툴로 만들기
retriever = vectorstore.as_retriever()

# LLM에이전트가 만약 유저가 내가 업로드한 문서에 관련된 질문을 하면 이 tool을 사용해서 검색을 하게 됨
tool = create_retriever_tool(
    retriever,
    "cusomter_service",
    "Searches and returns documents regarding the customer service guide.",
)
tools = [tool]

# 대화 내용 기억할 수 있는 메모리 부여
memory_key = "history"

from langchain.agents.openai_functions_agent.agent_token_buffer_memory import (
    AgentTokenBufferMemory,
)

memory = AgentTokenBufferMemory(memory_key=memory_key, llm=llm)

# 에이전트 만들기(할루시네이션 전처리)
# LLM이 어떤 행동을 해야하는지 알려주는 프롬프트
system_message = SystemMessage(
    content=(
        # 여기서는 챗봇에게 너는 어떤 챗봇인지 설명해주고, 위에서 만든 툴을 활용해서 답변을 하라고 해줌
        "You are a nice customer Insurance service agent."
        "Do your best to answer the questions."
        "Feel free to use any tools available to look up "
        "relevant information, only if necessary"
        # 할루시네이션 전처리 과정, 프롬프트로 "만약 보험약관과 관련되지 않은 질문이면 거짓된 답변을 생성하지 말아줘" 라고 처리
        "Please do not generate incorrect answers to questions that are not related to insurance terms and conditions"
        "If you don't know the answer, just say that you don't know. Don't try to make up an answer."
        # 챗봇이 한국어로 대답하게 함
        "Make sure to answer in Korean."
    )
)

# 위에서 만든 프롬프트를 바탕으로 LLM에게 줄 프롬프트 형식 셋업
prompt = OpenAIFunctionsAgent.create_prompt(
    system_message=system_message,
    extra_prompt_messages=[MessagesPlaceholder(variable_name=memory_key)],
)

# 위에서 만든 llm, tools, prompt를 바탕으로 에이전트 만들어주기
agent = OpenAIFunctionsAgent(llm=llm, tools=tools, prompt=prompt)

# 에이전트 실행하기
# 여기를 플라스크에서 질문을 받아오도록 바꾸기
from langchain.agents import AgentExecutor

agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    memory=memory,
    verbose=True,
    return_intermediate_steps=True,
)

result = agent_executor({"input": "안녕하세요"})
print(result)
