import sys
sys.path.append('C:\\github\\CapstoneDesign\\ai\\utils')
from Preprocess import Preprocess

import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
from tensorflow.keras import preprocessing
import pickle

def read_corpus_data(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        data = [line.split('\t') for line in f.read().splitlines()]
        data = data[1:]
    return data

corpus_data = read_corpus_data('C:\\github\\CapstoneDesign\\ai\\train_tools\\dict\\corpus.txt')

p = Preprocess()
dict = []
for c in corpus_data:
    pos = p.pos(c[1])
    for k in pos:
        dict.append(k[0])

# 사전에 사용될 word2index 생성
# 사전의 첫 번째 인덱스에는 OOV 사용
tokenizer = preprocessing.text.Tokenizer(oov_token='OOV')
tokenizer.fit_on_texts(dict)
word_index = tokenizer.word_index

# 사전 파일 생성
f = open("chatbot_dict.bin", "wb")
try:
    pickle.dump(word_index, f)
except Exception as e:
    print(e)
finally:
    f.close()