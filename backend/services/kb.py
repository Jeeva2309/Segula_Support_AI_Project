import os
import json
import numpy as np
from sentence_transformers import SentenceTransformer
import faiss

# Load configuration paths from Config (import lazily to avoid circular imports)
from config.config import Config

# Initialize model (singleton)
_MODEL = SentenceTransformer(Config.KB_EMBEDDING_MODEL)

def _load_index():
    if os.path.exists(Config.KB_INDEX_PATH):
        return faiss.read_index(Config.KB_INDEX_PATH)
    dim = _MODEL.get_sentence_embedding_dimension()
    return faiss.IndexFlatL2(dim)

def _load_docs():
    if os.path.exists(Config.KB_DOCS_PATH):
        with open(Config.KB_DOCS_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

_index = _load_index()
_docs = _load_docs()

def add_document(text: str):
    """Add a new knowledge‑base document and update the FAISS index."""
    emb = _MODEL.encode([text])
    _ = index.add(np.array(emb, dtype="float32"))
    _docs.append(text)
    # Persist
    faiss.write_index(index, Config.KB_INDEX_PATH)
    with open(Config.KB_DOCS_PATH, "w", encoding="utf-8") as f:
        json.dump(_docs, f, ensure_ascii=False, indent=2)

def search(query: str, top_k: int = 3):
    """Return a list of (document, distance) tuples most relevant to the query."""
    if not _docs:
        return []
    q_emb = _MODEL.encode([query])
    D, I = index.search(np.array(q_emb, dtype="float32"), top_k)
    results = []
    for idx, dist in zip(I[0], D[0]):
        if idx < len(_docs):
            results.append((_docs[idx], float(dist)))
    return results
