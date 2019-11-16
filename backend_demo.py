from flask import Flask, escape, request, jsonify
from flask_cors import CORS, cross_origin
from time import sleep

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


def allowed_file(file):
    return True


def process_file(file):
    print(file)
    sleep(2)
    return jsonify({"score": 75, "comment": "Ur mom gay"})


@app.route('/evaluate', methods=['POST'])
@cross_origin()
def upload_meme():
    if 'meme' not in request.files:
        return jsonify({"error": "No file part"})
    file = request.files['meme']
    if file.filename == '':
        return jsonify({"error": "No file selected"})
    if file and allowed_file(file.filename):
        return process_file(file)
    else:
        return jsonify({"error": "Invalid file"})
