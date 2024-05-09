from konlpy.tag import Komoran
import numpy as np
from numpy import dot
from numpy.linalg import norm
import mysql.connector

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'hansung',
    'database': 'capstone'
}

conn = mysql.connector.connect(**db_config)
cursor = conn.cursor()

def get_messages_from_db():
    try:
        # 쿼리 실행
        cursor.execute("SELECT content FROM message WHERE message_type='PERSON'")

        # 결과 가져오기
        messages = cursor.fetchall()

        return [message[0] for message in messages]  # content 값만 추출하여 리스트로 반환
    except mysql.connector.Error as err:
        print("Error reading data from MySQL table:", err)
        return []

def cos_sim(vec1, vec2):
    norm1 = norm(vec1)
    norm2 = norm(vec2)
    if norm1 == 0 or norm2 == 0:
        return 0.0  # 또는 다른 값으로 대체할 수 있음
    else:
        return dot(vec1, vec2) / (norm1 * norm2)


def make_term_doc_mat(sentence_bow, word_dics):
    freq_mat = {}
    for word in word_dics:
        freq_mat[word] = 0

    for word in word_dics:
        if word in sentence_bow:
            freq_mat[word] += 1

    return freq_mat


def make_vector(tdm):
    vec=[]
    for key in tdm:
        vec.append(tdm[key])
    return vec

sentences = get_messages_from_db()

komoran = Komoran()

bow_list = []
word_dics = []
freq_lists = []
bow_list_2 = []

for sentence in sentences:
    bow = komoran.nouns(sentence)
    bow_list += bow  # 리스트 확장
    bow_list_2.append(bow)

for token in bow_list:
    if token not in word_dics:
        word_dics.append(token)

for token in bow_list_2:
    freq_list = make_term_doc_mat(token, word_dics)
    freq_lists.append(freq_list)

print(freq_lists[4])
print(freq_lists[5])
print(freq_lists[6])

doc_vectors = [np.array(make_vector(freq_lists)) for freq_lists in freq_lists]

r1 = cos_sim(doc_vectors[4], doc_vectors[5])
r2 = cos_sim(doc_vectors[5], doc_vectors[6])
r3 = cos_sim(doc_vectors[6], doc_vectors[10])

print(r1)
print(r2)
print(r3)
