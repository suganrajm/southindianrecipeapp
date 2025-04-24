from flask import Flask, request, jsonify, render_template
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# Load and preprocess the dataset
df = pd.read_csv('south_indian_recipes.csv')
df['ingredients'] = df['ingredients'].str.lower()

# Fit the TF-IDF vectorizer
vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(df['ingredients'])

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/recommend', methods=['POST'])
def recommend():
    user_ingredients = request.json.get('ingredients', [])
    if not user_ingredients:
        return jsonify({'error': 'No ingredients provided.'}), 400

    # Combine user ingredients into a single string
    user_input = ', '.join(user_ingredients).lower()
    user_vector = vectorizer.transform([user_input])

    # Compute cosine similarity
    similarity_scores = cosine_similarity(user_vector, tfidf_matrix).flatten()
    top_indices = similarity_scores.argsort()[-5:][::-1]

    recommendations = []
    for idx in top_indices:
        recipe = {
            'name': df.iloc[idx]['name'],
            'ingredients': df.iloc[idx]['ingredients'],
            'steps': df.iloc[idx]['steps'],
            'image_url': df.iloc[idx]['image_url']  # Add image URL
        }
        recommendations.append(recipe)

    return jsonify({'recommendations': recommendations})

if __name__ == '__main__':
    app.run(debug=True)
