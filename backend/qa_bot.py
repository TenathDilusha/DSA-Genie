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

You MUST structure EVERY response using EXACTLY these markdown sections in order (skip a section only if truly not applicable):

## Explanation
A clear, concise explanation of the concept or problem. Use **bold** for key terms and bullet points for multiple ideas.

## Algorithm
Step-by-step approach or pseudocode. Use a numbered list.

## Code
Provide a complete, runnable code example using a fenced code block with a language tag (e.g. ```python). Always prefer Python unless the user specifies otherwise.

## Complexity Analysis
- **Time Complexity:** O(...)
- **Space Complexity:** O(...)

## Key Takeaways
Bullet-point summary of the most important points.

Rules:
- Always use the section headings above with ## prefix
- Use **bold** for key terms
- Use bullet points or numbered lists within sections
- Use fenced code blocks with language tags for ALL code
- Keep explanations clear and beginner-friendly
- If the question is conversational (greetings, thanks, etc.), respond naturally without forcing sections

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

def stream_question(question):
    """Yield tokens one-by-one as the LLM produces them."""
    for chunk in qa_chain.stream(question):
        yield chunk
