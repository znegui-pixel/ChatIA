from flask import Flask, request, jsonify
from flask_cors import CORS
from chat import load_model, get_response
import torch

app = Flask(__name__)
CORS(app)

# Charger le modèle au démarrage
model, all_words, tags = load_model()

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    message = data['message']
    response = get_response(message, model, all_words, tags)
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
