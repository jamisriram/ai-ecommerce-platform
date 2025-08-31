import os
import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from transformers import pipeline
from utils.image_feature_extractor import get_feature_extractor
from PIL import Image
from io import BytesIO
import numpy as np

app = Flask(__name__)
CORS(app)

# --- Load Pre-computed Data & Models on Startup ---
products_df = pd.read_pickle("product_data.pkl")
products_df['product_id'] = products_df['product_id'].astype(str)

# Content-Based Model
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(products_df['description'].fillna(''))
cosine_sim_content = cosine_similarity(tfidf_matrix, tfidf_matrix)

# Image Search Model
with open("image_features.pkl", "rb") as f:
    image_features = pickle.load(f)
image_feature_extractor = get_feature_extractor()

# Sentiment Analysis Model
sentiment_pipeline = pipeline(
    "sentiment-analysis", 
    model="distilbert-base-uncased-finetuned-sst-2-english", 
    framework="pt"
)

# NEW HEALTH CHECK ROUTE
@app.route('/health')
def health_check():
    return "OK", 200

@app.route('/recommend/content-based', methods=['POST'])
def recommend_content_based():
    # ... (rest of the function)
    data = request.get_json()
    product_id = data.get('product_id')
    
    if not product_id:
        return jsonify({"error": "Product ID is required"}), 400

    try:
        idx = products_df.index[products_df['product_id'] == product_id].tolist()[0]
        sim_scores = list(enumerate(cosine_sim_content[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        sim_scores = sim_scores[1:6]
        product_indices = [i[0] for i in sim_scores]
        
        recommended_ids = products_df['product_id'].iloc[product_indices].tolist()
        return jsonify(recommended_ids)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/search/image', methods=['POST'])
def search_by_image():
    # ... (rest of the function)
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    
    try:
        from tensorflow.keras.preprocessing import image
        from tensorflow.keras.applications.resnet50 import preprocess_input

        img = Image.open(BytesIO(file.read())).convert('RGB').resize((224, 224))
        x = image.img_to_array(img)
        x = np.expand_dims(x, axis=0)
        x = preprocess_input(x)
        uploaded_features = image_feature_extractor.predict(x).flatten()

        similarities = {}
        for pid, features in image_features.items():
            sim = cosine_similarity(uploaded_features.reshape(1, -1), features.reshape(1, -1))[0][0]
            similarities[pid] = sim
        
        sorted_pids = sorted(similarities, key=similarities.get, reverse=True)
        top_5_pids = [str(pid) for pid in sorted_pids[:5]]
        
        return jsonify(top_5_pids)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analyze/sentiment', methods=['POST'])
def analyze_sentiment():
    # ... (rest of the function)
    data = request.get_json()
    text = data.get('text')
    if not text:
        return jsonify({"error": "Text is required"}), 400
    
    result = sentiment_pipeline(text)[0]
    score = result['score']
    label = result['label']
    
    sentiment_score = score if label == 'POSITIVE' else 1 - score
    
    return jsonify({"label": label, "score": sentiment_score})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5002))
    app.run(host='0.0.0.0', port=port)