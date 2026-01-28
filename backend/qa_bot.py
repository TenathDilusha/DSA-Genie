from langchain_classic.chains.retrieval_qa.base import RetrievalQA
from rag_setup import setup_rag
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
import os

load_dotenv()

api_key = os.environ["API_KEY"]

vectorstore = setup_rag()
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

llm = ChatOpenAI(model="gpt-4.1-mini", streaming=True)

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever
)

def ask_question(question):
    response = qa_chain.run(question)
    return response
