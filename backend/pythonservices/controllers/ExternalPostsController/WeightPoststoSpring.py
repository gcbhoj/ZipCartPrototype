from flask import Blueprint, request, jsonify
from services.RasperrryPiServices.postWeightToSpring import post_weight
from services.ExternalServices.postToServer import send_post_request_to_spring
springPath = "http://localhost:500/api/v1/itemWeight"

#BlueprintDefinition

post_to_spring = Blueprint('post_to_spring',__name__)

@post_to_spring.route('/api/py/weight', methods=['POST'])
def post_weight_to_spring():
    try:
        # getting DTO from service
        item_weight_dto = post_weight()   # CALL the function

        # sending to Spring for processing
        result = send_post_request_to_spring(item_weight_dto, springPath)

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    

