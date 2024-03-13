from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route('/api/receive', methods=['POST'])
def receive_data():
    try:
        data = request.get_json()
        file_path = data.get('filePath')

        # 여기서 필요한 작업을 수행하고 응답을 반환할 수 있습니다.
        # 예를 들어, 받은 파일 경로를 출력하고 성공적인 응답을 반환합니다.
        print("Received file path:", file_path)

        # 여기서 작업을 수행하고 필요에 따라 응답을 구성합니다.
        response_data = {"status": "success", "message": "Data received successfully"}
        return jsonify(response_data), 200
    except Exception as e:
        # 오류가 발생하면 오류 응답을 반환합니다.
        error_data = {"status": "error", "message": str(e)}
        return jsonify(error_data), 500
# @app.route('/api/message/receive', methods=['POST'])
# def receive_message():
# # 여기에 메시지 받는 코드 작성하면 됨


if __name__ == '__main__':
    app.run(debug=True, port=5000)