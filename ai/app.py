from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

API_KEY = "sec_U8gkLvCfx4KOIyX3RwhdafCi2VoVIgJa"

@app.route('/api/receive', methods=['POST'])
def receive_data():
    try:
        data = request.get_json()
        file_path = data.get('filePath')
        question = data.get('question')

        # PDF 파일에 대한 소스 ID를 가져옵니다.
        source_id = get_pdf_source_id(file_path)

        if source_id is None:
            return jsonify({"error": "소스 ID를 가져오는 데 실패했습니다. 파일 경로를 확인하세요."}), 500

        # PDF API를 통해 질의응답을 처리합니다.
        chatpdf_result = chat_with_pdf_bot(source_id, question)

        return jsonify({"result": chatpdf_result}), 200

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



if __name__ == '__main__':
    app.run(debug=True, port=5000)
