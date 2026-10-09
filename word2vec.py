import pandas as pd
from gensim.models import Word2Vec
import os

df_train = pd.read_csv('processed_data/train.csv')
df_train['clean_instruction'] = df_train['clean_instruction'].fillna("")

sentences = [text.split() for text in df_train['clean_instruction']]

w2v_model = Word2Vec(
    sentences=sentences,
    vector_size=100,
    window=5,
    min_count=2,
    workers=4,
    epochs=10
)

os.makedirs('artifacts', exist_ok=True)
model_path = 'artifacts/word2vec.model'
w2v_model.save(model_path)
print("Word2Vec model trained and saved successfully.")