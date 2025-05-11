import torch
import random
from nlp_utils import tokenize, bag_of_words
from train import NeuralNet
import json

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

with open('intents.json', 'r') as json_data:
    intents = json.load(json_data)

FILE = "model/data.pth"
data = torch.load(FILE)

input_size = data["input_size"]
hidden_size = data["hidden_size"]
output_size = data["output_size"]
all_words = data["all_words"]
tags = data["tags"]
model_state = data["model_state"]

model = NeuralNet(input_size, hidden_size, output_size).to(device)
model.load_state_dict(model_state)
model.eval()
import os

normalization_map = {}
if os.path.exists('normalization.json'):
    with open('normalization.json', 'r') as f:
        normalization_map = json.load(f)
else:
    print("⚠️ Fichier normalization.json introuvable. Le chatbot fonctionnera sans normalisation.")

def normalize_text(sentence):
    """Remplacer les abréviations connues par des mots complets."""
    tokens = tokenize(sentence)
    normalized_tokens = []
    for token in tokens:
        token_lower = token.lower()
        if token_lower in normalization_map:
            normalized_tokens.append(normalization_map[token_lower])
        else:
            normalized_tokens.append(token)
    return " ".join(normalized_tokens)
from spellchecker import SpellChecker

def correct_sentence(sentence):
    spell = SpellChecker()
    corrected = []
    for word in tokenize(sentence):
        corrected.append(spell.correction(word))
    return " ".join(corrected)

def get_response(msg):
    msg = correct_sentence(msg)
    sentence = tokenize(msg)
    X = bag_of_words(sentence, all_words)
    X = X.reshape(1, X.shape[0])
    X = torch.from_numpy(X).to(device)

    output = model(X)
    _, predicted = torch.max(output, dim=1)

    tag = tags[predicted.item()]

    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]
    if prob.item() > 0.75:
        for intent in intents["intents"]:
            if tag == intent["tag"]:
                return random.choice(intent["responses"])

    return "Je ne comprends pas bien... Pouvez-vous reformuler ?"