from flask import Flask
from flask_cors import CORS

from controllers.BarCodeController.BarCodeController import bar_code_controller
from controllers.ExternalPostsController.WeightPoststoSpring import post_to_spring
from controllers.MLController.frutis_veg_identify import ml_controller



app = Flask(__name__)




CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:8100"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})



app.register_blueprint(bar_code_controller)
app.register_blueprint(post_to_spring)

# ML Services

app.register_blueprint(ml_controller)





if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0', port=5001)




