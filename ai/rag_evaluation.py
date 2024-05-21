import os
from langchain_community.document_loaders import WebBaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_openai import ChatOpenAI

os.environ["OPENAI_API_KEY"] = ""
# LLM 셋업하기
llm = ChatOpenAI(temperature=0)

# WebBaseLoader 함수가 " " 안에 있는 웹사이트 텍스트들을 불러옵니다.
loader = WebBaseLoader(
    "https://storage.googleapis.com/capstone_1971166_bucket/%EB%AC%B4%EB%B0%B0%EB%8B%B9%20%EB%A9%94%EB%A6%AC%EC%B8%A0%20%EC%9A%B4%EC%A0%84%EC%9E%90%20%EC%83%81%ED%95%B4%20%EC%A2%85%ED%95%A9%EB%B3%B4%ED%97%982404(%ED%99%94%EC%9E%AC%EB%B3%B4%ED%97%98).pdf")
# 데이터 로딩하기
data = loader.load()

# 불러온 데이터 스플릿하기
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
all_splits = text_splitter.split_documents(data)

# 불러온 데이터 Chroma라는 vector store에 저장하기.
# LLM 에이전트가 이 데이터베이스에 저장돼 있는 내용을 검색할 수 있도록 해주는 겁니다.
vectorstore = Chroma.from_documents(documents=all_splits, embedding=OpenAIEmbeddings())

# LLM 에이전트가 사용할 수 있도록 retriever 라는 툴로 만들어줍니다.
retriever = vectorstore.as_retriever()

from langchain.agents.agent_toolkits import create_retriever_tool

tool = create_retriever_tool(
    retriever,
    "customer_service",
    "Searches and returns documents regarding the customer service guide.",
)
tools = [tool]

memory_key = "history"

from langchain.agents.openai_functions_agent.agent_token_buffer_memory import (
    AgentTokenBufferMemory,
)

memory = AgentTokenBufferMemory(memory_key=memory_key, llm=llm)

from langchain.agents.openai_functions_agent.base import OpenAIFunctionsAgent
from langchain.schema.messages import SystemMessage
from langchain.prompts import MessagesPlaceholder

# LLM이 어떤 행동을 해야하는지 알려주는 프롬프트
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

# 위에서 만든 프롬프트를 바탕으로 LLM에게 줄 프롬프트 형식 셋업
prompt = OpenAIFunctionsAgent.create_prompt(
    system_message=system_message,
    extra_prompt_messages=[MessagesPlaceholder(variable_name=memory_key)],
)

# 위에서 만든 llm, tools, prompt를 바탕으로 에이전트 만들어주기
agent = OpenAIFunctionsAgent(llm=llm, tools=tools, prompt=prompt)

from langchain.agents import AgentExecutor

agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    memory=memory,
    verbose=True,
    return_intermediate_steps=True,
)

# result = agent_executor({"input": "안녕하세요"})
# print(result)

from datasets import Dataset

# RAGAS 코드 실행
questions = ["가지급보험금이 무엇입니까?",
             "특정4대중증치료비보장의 세부보장을 알려주세요",
             "민사소송법률비용보장 특별약관 보험금 청구하려면 어떤 서류를 제출해야하나요?",
             ]
ground_truths = [["보험금이 지급기한 내에 지급되지 못할 것으로 판단되는 경우 회사가 예상되는 보험금의 일부를 먼저 지급하는 제도로 피보험자가 필요로 하는 비용을 보전해 주기 위해 회사가 먼저 지급하는 임시 교부금을 말합니다."],
                 ["이 특별약관은  지속적신대체요법(CRRT)치료비, 인공호흡기(12시간초과)치료비, 저체온요법치료비, 부분체외순환치료비로 구성됩니다."],
                 ["피보험자가 보험금을 청구할 때에는 청구서(회사양식), 신분증(주민등록증이나 운전면허증 등 사진이 붙은 정부기관발행 신분증, 본인이 아닌 경우에는 본인의 인감증명서 또는 본인서명사실확인서 포함), 보험금지급을 위한 증명서(소장, 판결문, 소송상 조정, 소송상 화해 시 해당 조서, 선임한 변호사가 발급한 세금계산서, 소송비용액 확정결정서 등), 기타 보험수익자가 보험금의 수령에 필요하여 제출하는 서류 가 필요합니다"]]
answers = []
contexts = []

# Inference
for query in questions:
    result = agent_executor({"input": query})
    answers.append(result['output'])  # 'output' 속성을 사용하여 문자열로 변환
    contexts.append([docs.page_content for docs in retriever.get_relevant_documents(query)])

# To dict
data = {
    "question": questions,
    "answer": answers,
    "contexts": contexts,
    "ground_truth": [" ".join(gt) for gt in ground_truths]
}

dataset = Dataset.from_dict(data)

from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_recall,
    context_precision,
)

result = evaluate(
    dataset=dataset,
    metrics=[
        context_precision,
        context_recall,
        faithfulness,
        answer_relevancy,
    ],
)

df = result.to_pandas()
print(df)