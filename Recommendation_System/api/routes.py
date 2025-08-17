from flask import Blueprint
from controllers.recommendation_controller import RecommendationController

api_bp = Blueprint('api', __name__)

# Initialize controller
controller = RecommendationController()

@api_bp.route('/')
def home():
    return controller.home()

@api_bp.route('/training', methods=['POST'])
def training():
    return controller.training()

@api_bp.route('/get_recommendation', methods=['POST'])
def get_recommendation():
    return controller.get_recommendation()

@api_bp.route('/download_csv', methods=['GET'])
def download_csv():
    return controller.download_csv()