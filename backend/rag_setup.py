from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv
import fitz
import warnings
import os

load_dotenv()

os.environ["TOKENIZERS_PARALLELISM"] = "false"
os.environ["HF_HUB_VERBOSITY"] = "error"
warnings.filterwarnings("ignore")

FAISS_INDEX_PATH = "data/faiss_index"

def load_pdf(file_path):
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += str(page.get_text())
    return text

def setup_rag():
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs={"token": os.getenv("HF_TOKEN")},
    )

    faiss_index_file = os.path.join(FAISS_INDEX_PATH, "index.faiss")
    if os.path.exists(faiss_index_file):
        vectorstore = FAISS.load_local(
            FAISS_INDEX_PATH,
            embeddings,
            allow_dangerous_deserialization=True
        )
        return vectorstore

    # If index file does not exist, build and save the index
    text = load_pdf("data/DSA.pdf")
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100
    )
    docs = splitter.create_documents([text])
    vectorstore = FAISS.from_documents(docs, embeddings)
    vectorstore.save_local(FAISS_INDEX_PATH)
    return vectorstore
