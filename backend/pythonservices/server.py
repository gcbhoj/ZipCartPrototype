from flask import Flask
from controllers.BarCodeController.BarCodeController import bar_code_controller
from controllers.ExternalPostsController.WeightPoststoSpring import post_to_spring
from controllers.MLController.frutis_veg_identify import ml_controller



app = Flask(__name__)



app.register_blueprint(bar_code_controller)
app.register_blueprint(post_to_spring)

# ML Services

app.register_blueprint(ml_controller)





if __name__ == '__main__':
    app.run(debug=True,port=5001)




