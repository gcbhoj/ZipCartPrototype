import tensorflow as tf
import numpy as np
import os
from tensorflow.keras.models import load_model

base_dir = os.path.dirname(os.path.abspath(__file__))

model_path = os.path.join(base_dir, "..", "..", "MLModels", "fruits_veg_model.keras")
images_data_directory = os.path.join(base_dir, "..", "..", "Fruits_Vegetables", "test")

IMAGE_WIDTH = 180
IMAGE_HEIGHT = 180

# Load model once
model = load_model(model_path)

# Load class names once
dataset = tf.keras.utils.image_dataset_from_directory(
    images_data_directory,
    image_size=(IMAGE_WIDTH, IMAGE_HEIGHT),
    batch_size=32,
    shuffle=False
)

class_names = dataset.class_names


def predictImage(processedImage):
    """
    processedImage: tensor of shape (1, IMAGE_HEIGHT, IMAGE_WIDTH, 3)
    test_dataset: optional tf.data.Dataset to compute overall accuracy
    """

    # Predict the class for the input image
    predictions = model.predict(processedImage)
    score = tf.nn.softmax(predictions[0])  # take the first image in batch

    predicted_index = np.argmax(score)
    product_name = class_names[predicted_index]
    confidence = float(score[predicted_index] * 100)



    return {
        "productName": product_name,
        "confidence": confidence
    }