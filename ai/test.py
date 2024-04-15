import mysql.connector

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="hansung",
    database="capstone"
)

cursor = conn.cursor()

query = """
    SELECT chat_room.file_id, message.content
    FROM message
    INNER JOIN chat_room ON message.chat_room_id = chat_room.chat_room_id
    WHERE message.message_type = 'PERSON'
"""
cursor.execute(query)

results = cursor.fetchall()

file_id_to_messages = {}
for file_id, message in results:
    if file_id not in file_id_to_messages:
        file_id_to_messages[file_id] = []
    file_id_to_messages[file_id].append(message)

# 파일별로 메시지 출력
for file_id, messages in file_id_to_messages.items():
    print(f"File ID: {file_id}")
    for message in messages:
        print(message)

cursor.close()
conn.close()
