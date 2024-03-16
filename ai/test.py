from flask import Flask, request, jsonify

app = Flask(__name__)

# 파일 경로를 받는 엔드포인트
@app.route('/api/receive', methods=['POST'])
def receive_file_path():
    data = request.get_json()
    file_path = data.get('filePath')
    # 파일 경로를 처리하는 로직을 추가합니다.
    print("Received file path:", file_path)

    response_data = {"status": "success", "message": "Data received successfully"}
    return jsonify(response_data), 200

# 메시지를 받는 엔드포인트
@app.route('/api/message/receive', methods=['POST'])
def receive_message():
    data = request.get_json()
    message = data.get('content')
    # 메시지를 처리하는 로직을 추가합니다.
    print("Received message:", message)
    return jsonify(message="Message received successfully")

if __name__ == '__main__':
    app.run(debug=True)
