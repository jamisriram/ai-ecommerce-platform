import os
import pickle
import psycopg2
import pandas as pd
import requests
from PIL import Image
from io import BytesIO
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from tensorflow.keras.preprocessing import image as keras_image
from tensorflow.keras.models import Model
import numpy as np
from dotenv import load_dotenv

load_dotenv()

# --- Database Connection ---
DATABASE_URL = os.getenv("DATABASE_URL")

def get_product_data():
    """Fetches product data directly from the database."""
    conn = psycopg2.connect(DATABASE_URL)
    # THE FIX: Select 'description' in addition to the other columns
    query = "SELECT product_id, image_url, name, description FROM products"
    df = pd.read_sql_query(query, conn)
    conn.close()
    return df

# --- Feature Extraction Model ---
def get_feature_extractor():
    base_model = ResNet50(weights='imagenet')
    model = Model(inputs=base_model.input, outputs=base_model.get_layer('avg_pool').output)
    return model

def extract_features(img_url, model):
    """Downloads an image from a URL and extracts its features."""
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(img_url, timeout=20, headers=headers)
        response.raise_for_status()
        
        img = Image.open(BytesIO(response.content)).convert('RGB')
        img = img.resize((224, 224))
        
        x = keras_image.img_to_array(img)
        x = np.expand_dims(x, axis=0)
        x = preprocess_input(x)
        features = model.predict(x, verbose=0).flatten()
        return features
    except Exception as e:
        print(f"Could not process image {img_url}: {e}")
        return None

# --- Main Execution ---
if __name__ == "__main__":
    print("Starting feature extraction process...")
    
    products_df = get_product_data()
    # Save the dataframe, which now includes the 'description' column
    products_df.to_pickle("product_data.pkl")
    print(f"Saved product data for {len(products_df)} items to product_data.pkl")

    feature_extractor = get_feature_extractor()
    
    image_features = {}
    total_products = len(products_df)
    
    for index, row in products_df.iterrows():
        print(f"Processing ({index + 1}/{total_products}) {row['name'][:50]}...")
        features = extract_features(row['image_url'], feature_extractor)
        if features is not None:
            image_features[row['product_id']] = features
            
    with open("image_features.pkl", "wb") as f:
        pickle.dump(image_features, f)
        
    print(f"\nSuccessfully extracted and saved features for {len(image_features)} images to image_features.pkl")