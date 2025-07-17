'''
from flask import Flask, request, jsonify
import pickle

app = Flask(__name__)


with open('model.pkl', 'rb') as f:
    model = pickle.load(f)

with open('vectorizer.pkl', 'rb') as f:
    vectorizer = pickle.load(f)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    text = data.get("note", "")
    if not text:
        return jsonify({"error": "Note is required"}), 400
    
    X = vectorizer.transform([text])
    prediction = model.predict(X)[0]
    return jsonify({"category": prediction})

if __name__ == "__main__":
    app.run(debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS  # Add this
import pickle
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load model and vectorizer with error handling
try:
    with open('model.pkl', 'rb') as f:
        model = pickle.load(f)
    with open('vectorizer.pkl', 'rb') as f:
        vectorizer = pickle.load(f)
except Exception as e:
    print("ERROR: Failed to load model files. Re-train the model first!")
    print(str(e))
    exit(1)

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        if not data or "note" not in data:
            return jsonify({"error": "Missing 'note' field"}), 400
        
        text = data["note"].strip()
        if not text:
            return jsonify({"error": "Note cannot be empty"}), 400
        
        # Transform and predict
        X = vectorizer.transform([text])
        prediction = model.predict(X)[0]
        
        return jsonify({
            "category": prediction,
            "note": text  # Echo back for debugging
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
    '''
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load ML model
try:
    with open('model.pkl', 'rb') as f:
        model = pickle.load(f)
    with open('vectorizer.pkl', 'rb') as f:
        vectorizer = pickle.load(f)
except Exception as e:
    print(f"❌ Error loading model files: {str(e)}")
    exit(1)

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        note = data.get("note", "").strip()
        
        if not note:
            return jsonify({"error": "Note is required"}), 400
            
        # Transform and predict
        X = vectorizer.transform([note])
        category = model.predict(X)[0]
        
        return jsonify({
            "category": category,
            "note": note  # Echo back for debugging
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)