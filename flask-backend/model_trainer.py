'''
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
import pickle


df = pd.read_csv("flask-backend/expense_dataset (1).csv") 


X_raw = df['Title']
y = df['Category']


vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(X_raw)


model = LinearSVC()
model.fit(X, y)

with open("model.pkl", "wb") as f:
    pickle.dump(model, f)


with open("vectorizer.pkl", "wb") as f:
    pickle.dump(vectorizer, f)

print("✅ Trained with Linear SVM and saved model + vectorizer!")
'''

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
import pickle
import os
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# 1. Data Loading with Validation
try:
    df = pd.read_csv("flask-backend/expense_dataset (1).csv")
    if df.empty or 'Title' not in df.columns or 'Category' not in df.columns:
        raise ValueError("Invalid dataset format - missing required columns")
except Exception as e:
    print(f"❌ Data loading failed: {str(e)}")
    exit(1)

# 2. Data Preparation
X_raw = df['Title'].astype(str)  # Ensure text data
y = df['Category']

# 3. Train-Test Split (80-20)
X_train, X_test, y_train, y_test = train_test_split(
    X_raw, y, test_size=0.2, random_state=42
)

# 4. Vectorization with Error Handling
try:
    vectorizer = TfidfVectorizer(
        min_df=2,  # Ignore rare words
        max_features=5000,  # Control memory usage
        ngram_range=(1, 2)  # Consider word pairs
    )
    X_train_vec = vectorizer.fit_transform(X_train)
except Exception as e:
    print(f"❌ Vectorization failed: {str(e)}")
    exit(1)

# 5. Model Training
try:
    model = LinearSVC(
        C=0.5,  # Regularization parameter
        class_weight='balanced',  # Handle imbalanced classes
        max_iter=2000  # Ensure convergence
    )
    model.fit(X_train_vec, y_train)
except Exception as e:
    print(f"❌ Model training failed: {str(e)}")
    exit(1)

# 6. Model Evaluation
X_test_vec = vectorizer.transform(X_test)
y_pred = model.predict(X_test_vec)
print("\n📊 Model Evaluation Report:")
print(classification_report(y_test, y_pred))

# 7. Save Artifacts with Versioning
MODEL_VERSION = "1.0"
ARTIFACT_DIR = "model_artifacts"
os.makedirs(ARTIFACT_DIR, exist_ok=True)

try:
    with open(f"{ARTIFACT_DIR}/model_v{MODEL_VERSION}.pkl", "wb") as f:
        pickle.dump(model, f)
    with open(f"{ARTIFACT_DIR}/vectorizer_v{MODEL_VERSION}.pkl", "wb") as f:
        pickle.dump(vectorizer, f)
    
    # Save metadata
    with open(f"{ARTIFACT_DIR}/meta_v{MODEL_VERSION}.txt", "w") as f:
        f.write(f"Model version: {MODEL_VERSION}\n")
        f.write(f"Training date: {pd.Timestamp.now()}\n")
        f.write(f"Classes: {list(model.classes_)}\n")
        f.write(f"Test accuracy: {model.score(X_test_vec, y_test):.2f}\n")
        
except Exception as e:
    print(f"❌ Failed to save artifacts: {str(e)}")
    exit(1)

print(f"\n✅ Successfully trained and saved model (v{MODEL_VERSION})!")
print(f"Artifacts saved in: {os.path.abspath(ARTIFACT_DIR)}")