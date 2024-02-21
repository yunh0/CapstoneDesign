from flask import Flask, jsonify, request
import requests

app = Flask(__name__)

@app.route('/test')
def test():
    response = requests.get("http://localhost:8080/api/test")
    return response.text

if __name__ == '__main__':
    app.run(debug=True)
