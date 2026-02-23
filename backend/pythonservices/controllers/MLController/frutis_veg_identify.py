import os
import uuid
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename

from services.MLServices.identify_product_by_image import identify_image

ml_controller = Blueprint('ml_controller', __name__)

UPLOAD_FOLDER = "temp_uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@ml_controller.route('/api/py/predict_fruits_veg', methods=['POST'])
def identify_fruit_veg_image():

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Unique filename
    filename = secure_filename(file.filename)
    unique_name = str(uuid.uuid4()) + "_" + filename
    temp_file_path = os.path.join(UPLOAD_FOLDER, unique_name)

    try:
        file.save(temp_file_path)
        result = identify_image(temp_file_path)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)