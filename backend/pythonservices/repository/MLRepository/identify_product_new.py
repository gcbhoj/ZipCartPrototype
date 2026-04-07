import tensorflow as tf
import numpy as np
import os
from tensorflow.keras.models import load_model
from tensorflow.keras.utils import load_img, img_to_array
from models.FruitsvegPredictResultDTO import FruitsVegPredictResults

# -------------------------------
# Paths & Constants
# -------------------------------
BASE_PATH = os.getenv("APP_BASE_PATH", os.getcwd())

MODEL_PATH = os.path.join(BASE_PATH, "MLModels", "fruits_veg_identify.keras")
CLASSES_PATH = os.path.join(BASE_PATH, "MLModels", "classes.txt")

IMAGE_SIZE = 224

# -------------------------------
# Load class names
# -------------------------------
if not os.path.exists(CLASSES_PATH):
    raise FileNotFoundError(f"Classes file not found at {CLASSES_PATH}")

with open(CLASSES_PATH, "r") as f:
    class_names = [line.strip() for line in f.readlines()]

# -------------------------------
# Lazy load model
# -------------------------------
model = None

def get_model():
    global model
    if model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model not found at {MODEL_PATH}")
        model = load_model(MODEL_PATH)
    return model

# -------------------------------
# Preprocessing helper
# -------------------------------
def prepare_image(image_path):
    img = load_img(image_path, target_size=(IMAGE_SIZE, IMAGE_SIZE))
    img_array = img_to_array(img) / 255.0
    img_batch = tf.expand_dims(img_array, axis=0)
    return img_batch

# -------------------------------
# Prediction function
# -------------------------------
def predictImage(image_path, threshold=0.6):
    try:
        processed_image = prepare_image(image_path)

        preds = get_model().predict(processed_image)
        preds = np.squeeze(preds)

        predicted_index = np.argmax(preds)
        product_name = class_names[predicted_index]
        confidence = float(preds[predicted_index])

        if confidence < threshold:
            product_name = "Unknown"

        result = FruitsVegPredictResults(confidence * 100, product_name)

        top_indices = preds.argsort()[-3:][::-1]
        top_preds = [
            {"productName": class_names[i], "confidence": float(preds[i] * 100)}
            for i in top_indices
        ]

        return {
            "success": True,
            "data": result,
            "topPredictions": top_preds
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }