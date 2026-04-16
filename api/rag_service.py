import chromadb
from sentence_transformers import SentenceTransformer
import requests
from .models import Book

# Initialize ChromaDB (Vector Store) and the Embedding Model
# This handles the requirement for vector-based similarity search [cite: 81, 119]
chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection = chroma_client.get_or_create_collection(name="book_collection")
embedder = SentenceTransformer('all-MiniLM-L6-v2')

def get_ai_answer(question):
    # 1. Generate an embedding for the user's question [cite: 44]
    query_vector = embedder.encode(question).tolist()
    
    # 2. Perform similarity search across stored book chunks [cite: 45]
    results = collection.query(query_embeddings=[query_vector], n_results=2)
    
    # 3. Construct the context from retrieved chunks [cite: 46]
    if results['documents'] and results['documents'][0]:
        context = " ".join(results['documents'][0])
    else:
        context = "No specific book data found."

    # 4. Generate the answer using your local LM Studio model [cite: 47, 86]
    # This ensures data privacy and cost-effectiveness as required [cite: 89]
    url = "http://localhost:1234/v1/chat/completions"
    payload = {
        "messages": [
            {
                "role": "system", 
                "content": f"You are a book assistant. Use the following context to answer: {context}. Always cite the book title if known."
            },
            {"role": "user", "content": question}
        ],
        "temperature": 0.7
    }

    try:
        response = requests.post(url, json=payload)
        return response.json()['choices'][0]['message']['content']
    except Exception as e:
        return f"Error connecting to LM Studio: {str(e)}. Make sure the server is started on port 1234."