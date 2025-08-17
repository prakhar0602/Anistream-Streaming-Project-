import numpy as np
from services.data_service import DataService

def cosine_similarity(a, b):
    """Calculate cosine similarity between vectors"""
    dot_product = np.dot(a, b.T)
    norm_a = np.linalg.norm(a, axis=1, keepdims=True)
    norm_b = np.linalg.norm(b, axis=1, keepdims=True)
    return dot_product / (norm_a * norm_b.T)

class RecommendationService:
    def __init__(self):
        self.data_service = DataService()
    
    def get_recommendations(self, user_id):
        data = self.data_service.get_data()
        my_anime_df = data['my_anime_df']
        combined_anime_df = data['combined_anime_df']
        combined_anime_embeddings_df = data['combined_anime_embeddings_df']
        
        if any(df is None for df in [my_anime_df, combined_anime_df, combined_anime_embeddings_df]):
            return []
        
        watched_anime_by_user = my_anime_df[(my_anime_df['user_id'] == user_id) & (my_anime_df['watched'] == 1)]
        watched_anime_ids = watched_anime_by_user['anime_id'].tolist()
        
        if not watched_anime_ids:
            return []
        
        watched_anime_embeddings = combined_anime_embeddings_df[
            combined_anime_embeddings_df['anime_id'].isin(watched_anime_ids)
        ].drop(columns=['anime_id'])
        
        if watched_anime_embeddings.empty:
            return []
        
        user_embedding = watched_anime_embeddings.mean(axis=0).values.reshape(1, -1)
        embeddings_matrix = combined_anime_embeddings_df.drop(columns=['anime_id']).values
        cosine_sim = cosine_similarity(user_embedding, embeddings_matrix)
        sim_scores = list(enumerate(cosine_sim[0]))
        
        watched_anime_combined_indices = combined_anime_df[
            combined_anime_df['anime_id'].isin(watched_anime_ids)
        ].index.tolist()
        
        sim_scores = [i for i in sim_scores if i[0] not in watched_anime_combined_indices]
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        
        top_anime_indices = [i[0] for i in sim_scores[0:10]]
        
        recommendations = []
        for index in top_anime_indices:
            anime = combined_anime_df.iloc[index]
            recommendations.append({
                'anime_id': anime['anime_id'],
                'type': anime['type']
            })
        
        return recommendations