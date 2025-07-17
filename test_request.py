import requests

note = "toothpaste"

response = requests.post(
    "http://127.0.0.1:5000/predict",
    json={"note": note}
)

if response.status_code == 200:
    print("✅ Predicted category:", response.json()["category"])
else:
    print("❌ Error:", response.status_code, response.text)
