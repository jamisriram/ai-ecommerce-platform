import os
import pandas as pd
import psycopg2
from dotenv import load_dotenv
import re
import random

# --- SETUP ---
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
CSV_FILE_PATH = 'data_fashion.csv'

# --- HELPER FUNCTIONS ---
def clean_text(text):
    if not isinstance(text, str):
        return "No description available."
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

# --- MAIN SCRIPT ---
def populate_database():
    print("Connecting to the database...")
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    print("Cleaning old product data...")
    cur.execute("DELETE FROM reviews;")
    cur.execute("DELETE FROM products;")
    conn.commit()

    print(f"Reading data from {CSV_FILE_PATH}...")
    df = pd.read_csv(CSV_FILE_PATH)
    
    print("\nOriginal columns found in CSV file:")
    print(df.columns.tolist())
    
    # --- Smart Column Mapping ---
    column_map = {
        'title': 'name',
        'imgUrl': 'image_url',
        'price': 'price',
        'category_id': 'category'
    }

    df = df.rename(columns=column_map)
    
    # --- Generate data for missing columns ---
    print("Generating missing data...")
    if 'description' not in df.columns:
        df['description'] = df['name']
    if 'brand' not in df.columns:
        df['brand'] = 'Fashion Find'

    # --- Data Cleaning and Filtering ---
    required_cols = ['name', 'price', 'image_url', 'description']
    df = df.dropna(subset=required_cols)
    df = df[df['name'].str.len() > 1]
    
    df = df.head(300)
    
    print(f"Processing and inserting {len(df)} products...")
    
    insert_query = """
    INSERT INTO products (name, category, price, brand, description, image_url, count_in_stock)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """

    for index, row in df.iterrows():
        try:
            price_str = str(row['price']).replace('$', '').replace(',', '')
            price = float(price_str)
        except (ValueError, TypeError):
            continue
        
        if not str(row['image_url']).startswith('http'):
            continue

        product_data = (
            row['name'][:255],
            # THE FIX IS HERE: Convert the category value to a string before slicing
            str(row.get('category', 'Fashion'))[:100],
            price,
            row['brand'][:100],
            clean_text(row['description']),
            row['image_url'],
            random.randint(10, 200)
        )
        
        cur.execute(insert_query, product_data)

    print("\nCommitting changes to the database...")
    conn.commit()

    print("Closing connection.")
    cur.close()
    conn.close()
    
    print("\n✅ Database population with real image data is complete!")

if __name__ == "__main__":
    populate_database()