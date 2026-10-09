import numpy as np
from gensim.models import Word2Vec
from sklearn.base import BaseEstimator, TransformerMixin


class Word2VecVectorizer(BaseEstimator, TransformerMixin):
    """Mean-pooled Word2Vec document embeddings as a scikit-learn transformer.

    Fits a gensim Word2Vec on the training texts and, at transform time, averages the
    vectors of the recognized tokens per document (unknown tokens are ignored; a
    document with no known token becomes a zero vector). Deterministic: workers=1 and a
    fixed seed. Importable so an exported pipeline that embeds this transformer can be
    unpickled for deployment.
    """

    def __init__(self, vector_size=128, window=5, min_count=2, workers=1,
                 seed=42, epochs=20):
        self.vector_size = vector_size
        self.window = window
        self.min_count = min_count
        self.workers = workers
        self.seed = seed
        self.epochs = epochs

    def fit(self, texts, y=None):
        corpus = [str(t).split() for t in texts]
        self.model_ = Word2Vec(
            sentences=corpus,
            vector_size=self.vector_size,
            window=self.window,
            min_count=self.min_count,
            workers=self.workers,
            seed=self.seed,
            epochs=self.epochs,
        )
        return self

    def transform(self, texts):
        out = np.zeros((len(texts), self.vector_size), dtype=np.float32)
        wv = self.model_.wv
        for i, text in enumerate(texts):
            vecs = [wv[w] for w in str(text).split() if w in wv]
            if vecs:
                out[i] = np.mean(vecs, axis=0)
        return out
