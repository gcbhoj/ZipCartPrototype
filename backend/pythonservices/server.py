from flask import Flask
from controllers.BarCodeController.BarCodeController import bar_code_controller



app = Flask(__name__)



app.register_blueprint(bar_code_controller)





if __name__ == '__main__':
    app.run(debug=True,port=5001)




