from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

API_KEY = "sec_U8gkLvCfx4KOIyX3RwhdafCi2VoVIgJa"
source_id = None

@app.route('/api/receive', methods=['POST'])
def receive_file_path():
    try:
        data = request.get_json()
        file_path = data.get('filePath')
        global source_id
        # PDF 파일에 대한 소스 ID를 가져옵니다.
        source_id = get_pdf_source_id(file_path)
        print(file_path)
        print(source_id)

        if source_id is None:
            return jsonify({"error": "소스 ID를 가져오는 데 실패했습니다. 파일 경로를 확인하세요."}), 500

        return jsonify({"sourceId": source_id}), 200

    except Exception as e:
        # 오류가 발생하면 오류 응답을 반환합니다.
        error_data = {"status": "error", "message": str(e)}
        return jsonify(error_data), 500

@app.route('/api/message/receive', methods=['POST'])
def receive_question():
    try:
        data = request.get_json()
        question = data.get('content')

        print(source_id)
        print(question)
        # chatpdf API를 통해 질문과 소스 ID에 대한 응답을 처리합니다.
        chatpdf_response = chat_with_pdf_bot(question, source_id)
        print(chatpdf_response)
        response_data = {"status": "success", "message": chatpdf_response}
        return jsonify(response_data), 200

    except Exception as e:
        # 오류가 발생하면 오류 응답을 반환합니다.
        error_data = {"status": "error", "message": str(e)}
        return jsonify(error_data), 500

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

def chat_with_pdf_bot(question, source_id):
    endpoint = 'https://api.chatpdf.com/v1/chats/message'
    headers = {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
    }

    messages = [
        {'role': 'user', 'content': question},
        {'role': '당신은 보험약관 전문가입니다.', 'content': '', 'temperature': 0.2}
    ]

    data = {'sourceId': source_id, 'messages': messages}

    response = requests.post(endpoint, headers=headers, json=data)

    if response.status_code == 200:
        return response.json().get('content')
    else:
        return "ChatPDF API로부터 응답을 받는 데 실패했습니다."

if __name__ == '__main__':
    app.run(debug=True, port=5000)