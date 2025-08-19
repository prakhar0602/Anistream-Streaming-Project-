from flask import Flask
from flask_cors import CORS
from api.routes import api_bp
from services.model_service import ModelService

def create_app():
    app = Flask(__name__)
    
    # Enable CORS
    CORS(app)
    
    # Initialize model at startup to avoid repeated downloads
    ModelService.initialize()
    
    # Register blueprints
    app.register_blueprint(api_bp, url_prefix='/api')
    
    return app

if __name__ == '__main__':
    import os
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)