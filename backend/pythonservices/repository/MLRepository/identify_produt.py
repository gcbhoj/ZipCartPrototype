import tensorflow as tf
import numpy as np
import os
from tensorflow.keras.models import load_model
from tensorflow.keras.utils import load_img, img_to_array
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from models.FruitsvegPredictResultDTO import FruitsVegPredictResults

# -------------------------------
# Paths & Constants
# -------------------------------
base_dir = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(base_dir, "..", "..", "MLModels", "fruits_veg_identify.keras")
TEST_DATA_DIR = os.path.join(base_dir, "..", "..", "Fruits_data", "test")
IMAGE_SIZE = 224

# -------------------------------
# Load model once
# -------------------------------
model = load_model(MODEL_PATH)

# -------------------------------
# Load class names once
# -------------------------------
dataset = tf.keras.utils.image_dataset_from_directory(
    TEST_DATA_DIR,
    image_size=(IMAGE_SIZE, IMAGE_SIZE),
    batch_size=32,
    shuffle=False
)
class_names = dataset.class_names

# -------------------------------
# Preprocessing helper
# -------------------------------
def prepare_image(image_path):
    img = load_img(image_path, target_size=(IMAGE_SIZE, IMAGE_SIZE))
    img_array = img_to_array(img)/255.0
    img_batch = tf.expand_dims(img_array, axis=0)
    return img_batch

# -------------------------------
# Prediction function
# -------------------------------
def predictImage(image_path, threshold=0.6):
    try:
        processed_image = prepare_image(image_path)
        preds = model.predict(processed_image)
        preds = np.squeeze(preds)  # remove batch dimension if present

        predicted_index = np.argmax(preds)
        product_name = class_names[predicted_index]
        confidence = float(preds[predicted_index])  # already 0-1 scale

        # If confidence below threshold, return Unknown
        if confidence < threshold:
            product_name = "Unknown"

        result = FruitsVegPredictResults(confidence*100, product_name)  # scale to 0-100

        # Top 3 predictions
        top_indices = preds.argsort()[-3:][::-1]
        top_preds = [{"productName": class_names[i], "confidence": float(preds[i]*100)} for i in top_indices]

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