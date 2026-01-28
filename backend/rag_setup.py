from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
import fitz

def load_pdf(file_path):
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += str(page.get_text())
    return text

def setup_rag():
    text = load_pdf("data/DSA.pdf")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100
    )
    docs = splitter.create_documents([text])

    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    vectorstore = FAISS.from_documents(docs, embeddings)

    return vectorstore
