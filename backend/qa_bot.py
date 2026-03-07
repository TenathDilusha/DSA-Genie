from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from rag_setup import setup_rag
from langchain_ollama import ChatOllama

vectorstore = setup_rag()
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

llm = ChatOllama(model="llama3.2", temperature=0)

prompt = ChatPromptTemplate.from_template("""You are a DSA (Data Structures and Algorithms) expert assistant.
Answer the question using the context provided below.
Format your response using markdown:
- Use **bold** for key terms
- Use headings (##) to separate sections when relevant
- Use bullet points or numbered lists for steps or multiple items
- Use fenced code blocks with a language tag (e.g. ```python) for all code
- Keep explanations clear and concise

Context: {context}

Question: {question}

Answer:""")

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

qa_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

def ask_question(question):
    return qa_chain.invoke(question)
