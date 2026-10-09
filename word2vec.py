import os
import pandas as pd

from vectorizers import Word2VecVectorizer

df_train = pd.read_csv("processed_data/train.csv")
df_train["clean_instruction"] = df_train["clean_instruction"].fillna("")

vec = Word2VecVectorizer().fit(df_train["clean_instruction"])

os.makedirs("artifacts", exist_ok=True)
model_path = "artifacts/word2vec.model"
vec.model_.save(model_path)

m = vec.model_
print(f"Word2Vec model trained and saved to {model_path}")
print(f"vector_size={m.wv.vector_size} | vocab={len(m.wv)} | epochs={m.epochs}")
