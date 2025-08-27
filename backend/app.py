from flask import Flask, request, jsonify
import joblib
import traceback
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

# Load model components
model = joblib.load('xgb_mainaccord1_model.joblib')
vectorizer = joblib.load('tfidf_vectorizer.joblib')
label_encoder = joblib.load('label_encoder.joblib')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print("🟢 Received JSON:", data)

        top = data.get('top', [])
        middle = data.get('middle', [])
        base = data.get('base', [])
        print("Top:", top)
        print("Middle:", middle)
        print("Base:", base)

        if not (top or middle or base):
            return jsonify({'error': 'Missing notes'}), 400

        combined = ' '.join(top + middle + base)
        print("Combined input:", combined)

        vectorized_input = vectorizer.transform([combined])
        prediction = model.predict(vectorized_input)
        predicted_label = label_encoder.inverse_transform(prediction)[0]

        print("Predicted label:", predicted_label)

        return jsonify({'prediction': predicted_label})

    except Exception as e:
        print("🔴 Error during prediction:")
        traceback.print_exc()
        return jsonify({
            'error': str(e),
            'trace': traceback.format_exc()
        }), 500

print("📏 IDF shape:", vectorizer.idf_.shape)


if __name__ == '__main__':
    app.run(debug=True)
