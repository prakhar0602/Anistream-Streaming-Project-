from flask import Flask
from api.routes import api_bp
from services.model_service import ModelService

def create_app():
    app = Flask(__name__)
    
    # Initialize model service
    ModelService.initialize()
    
    # Register blueprints
    app.register_blueprint(api_bp, url_prefix='/api')
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)