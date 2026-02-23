import tensorflow as tf
import numpy as np

from repository.MLRepository.identify_produt import predictImage

IMAGE_WIDTH = 180
IMAGE_HEIGHT = 180


def identify_image(image_path):
    # Load image
    image_load = tf.keras.utils.load_img(
        image_path, target_size=(IMAGE_HEIGHT, IMAGE_WIDTH)
    )

    # Convert to numpy array
    image_arr = tf.keras.utils.array_to_img(image_load)

    image_batch = tf.expand_dims(image_arr,0)

    # Call repository layer
    result = predictImage(image_batch)

    return result