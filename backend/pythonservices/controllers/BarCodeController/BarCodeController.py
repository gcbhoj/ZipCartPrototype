from flask import Blueprint, request, jsonify
from services.BarCodeServices.simple_decoder import simple_decoder
import os




#BluePrint Definitions

bar_code_controller = Blueprint('bar_code_controller',__name__)


# the following block of code can be used to decode simple bar codes that spring progam is having difficulty reading with
#  this method is to be called from sping when a user uploads a picture of the barcode


@bar_code_controller.route('/api/py/simple_decode',methods=['POST'])
def get_simple_barcode_decoded_value():
    if 'file' not in request.files:
        return jsonify({"error": "No File par"}),400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error":"No Selected file"}),400
    
    temp_path = "temp_upload.jpg"
    file.save(temp_path)
    
    
    try:
        # Call the decoder function
        result = simple_decoder(temp_path)
    finally:
        # Delete the temporary file to clean up
        if os.path.exists(temp_path):
            os.remove(temp_path)
    
    
    return jsonify(result)
    