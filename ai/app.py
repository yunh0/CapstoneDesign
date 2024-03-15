from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

API_KEY = "sec_U8gkLvCfx4KOIyX3RwhdafCi2VoVIgJa"

def get_pdf_source_id(pdf_file_path):
    endpoint = 'https://api.chatpdf.com/v1/sources/add-file'
    headers = {'x-api-key': API_KEY}

    with open(pdf_file_path, 'rb') as file:
        files = {'file': ('file', file, 'application/octet-stream')}
        response = requests.post(endpoint, headers=headers, files=files)

    if response.status_code == 200:
        return response.json().get('sourceId')
    else:
        return None

def chat_with_pdf_bot(source_id, question):
    endpoint = 'https://api.chatpdf.com/v1/chats/message'
    headers = {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
    }

    messages = [
        {'role': 'user', 'content': question},
        {'role': 'assistant', 'content': ''}
    ]

    response = requests.post(endpoint, headers=headers, json={'sourceId': source_id, 'messages': messages})

    if response.status_code == 200:
        return response.json().get('content')
    else:
        return "ChatPDF API로부터 응답을 받는 데 실패했습니다."

@app.route("/api/text", methods=["POST"])  # 다른 올바른 엔드포인트로 변경
def chatpdf_interaction():
    request_data = request.get_json()

    pdf_file_path = request_data.get("pdf_file_path")
    question = request_data.get("question")

    if not pdf_file_path:
        return jsonify({"error": "PDF 파일 경로가 없습니다."}), 400
    if not question:
        return jsonify({"error": "질문이 없습니다."}), 400

    source_id = get_pdf_source_id(pdf_file_path)

    if source_id is None:
        return jsonify({"error": "소스 ID를 가져오는 데 실패했습니다. 파일 경로를 확인하세요."}), 500

    chatpdf_result = chat_with_pdf_bot(source_id, question)

    return jsonify({"result": chatpdf_result})

if __name__ == "__main__":
    app.run(debug=True)
