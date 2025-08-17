from flask import request, jsonify, send_file
from services.recommendation_service import RecommendationService
from services.data_service import DataService
import io

class RecommendationController:
    def __init__(self):
        self.recommendation_service = RecommendationService()
        self.data_service = DataService()
    
    def home(self):
        return "Model loaded successfully!"
    
    def training(self):
        new_data = request.get_json(force=True)
        result = self.data_service.add_training_data(new_data)
        return jsonify(result)
    
    def get_recommendation(self):
        data = request.get_json(force=True)
        user_id = data['user_id']
        recommendations = self.recommendation_service.get_recommendations(user_id)
        return jsonify({'recommendations': recommendations})
    
    def download_csv(self):
        csv_data = self.data_service.export_csv()
        if csv_data is None:
            return jsonify({'error': 'No data available'})
        
        return send_file(csv_data, mimetype='text/csv', as_attachment=True, download_name='updated_anime_list.csv')