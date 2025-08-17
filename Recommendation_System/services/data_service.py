import pandas as pd
import os
import io
from services.model_service import ModelService

class DataService:
    _instance = None
    _initialized = False
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DataService, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not DataService._initialized:
            self.combined_anime_df = None
            self.combined_anime_embeddings_df = None
            self.my_anime_df = None
            self.load_initial_data()
            DataService._initialized = True
    
    def load_initial_data(self):
        try:
            if os.path.exists('my_anime_list.csv'):
                self.my_anime_df = pd.read_csv('my_anime_list.csv')
                self.my_anime_df['watched'] = 1  # All entries are watched
                self._preprocess_and_generate_embeddings()
                print("Initial data loaded successfully")
        except Exception as e:
            print(f"Error loading initial data: {e}")
    
    def add_training_data(self, new_data):
        # Get all unique users from the dataset
        all_users = set()
        for anime in new_data:
            all_users.update(anime['user_ids'])
        
        # Create records for each anime-user combination
        records = []
        for anime in new_data:
            genre_str = ' '.join(anime['genre']) if isinstance(anime['genre'], list) else anime['genre']
            watched_users = set(anime['user_ids'])
            
            for user_id in all_users:
                records.append({
                    'anime_id': anime['anime_id'],
                    'name': anime['name'],
                    'genre': genre_str,
                    'type': anime['type'],
                    'user_id': user_id,
                    'watched': 1 if user_id in watched_users else 0
                })
        
        # Replace old data with new data
        if records:
            self.my_anime_df = pd.DataFrame(records)
            self.combined_anime_df = self.my_anime_df.drop_duplicates(subset=['anime_id']).reset_index(drop=True)
        else:
            self.my_anime_df = pd.DataFrame(columns=['anime_id', 'name', 'genre', 'type', 'user_id', 'watched'])
            self.combined_anime_df = pd.DataFrame(columns=['anime_id', 'name', 'genre', 'type'])
        
        self._preprocess_and_generate_embeddings()
        return {
            'status': 'training completed',
            'total_records': len(self.my_anime_df),
            'unique_anime': len(self.combined_anime_df)
        }
    
    def _preprocess_and_generate_embeddings(self):
        if self.my_anime_df is not None and not self.my_anime_df.empty:
            self.my_anime_df['anime_id'] = self.my_anime_df['anime_id'].astype(str)
            self.my_anime_df['user_id'] = self.my_anime_df['user_id'].astype(str)
            self.my_anime_df['name'] = self.my_anime_df['name'].fillna('')
            self.my_anime_df['genre'] = self.my_anime_df['genre'].fillna('')
            self.my_anime_df['type'] = self.my_anime_df['type'].fillna('series')
        
        if self.combined_anime_df is not None and not self.combined_anime_df.empty:
            self.combined_anime_df['anime_id'] = self.combined_anime_df['anime_id'].astype(str)
            self.combined_anime_df['name'] = self.combined_anime_df['name'].fillna('')
            self.combined_anime_df['genre'] = self.combined_anime_df['genre'].fillna('')
            self.combined_anime_df['type'] = self.combined_anime_df['type'].fillna('series')
            self.combined_anime_df['text_for_embedding'] = self.combined_anime_df['name'] + ' ' + self.combined_anime_df['genre'] + ' ' + self.combined_anime_df['type']
            
            text_list = self.combined_anime_df['text_for_embedding'].dropna().tolist()
            model = ModelService.get_model()
            combined_anime_embeddings = model.encode(text_list)
            self.combined_anime_embeddings_df = pd.DataFrame(combined_anime_embeddings)
            self.combined_anime_embeddings_df['anime_id'] = self.combined_anime_df['anime_id']
    
    def export_csv(self):
        if self.my_anime_df is None:
            return None
        
        output = io.StringIO()
        self.my_anime_df[['anime_id', 'name', 'genre', 'type', 'user_id', 'watched']].to_csv(output, index=False)
        output.seek(0)
        
        csv_data = io.BytesIO()
        csv_data.write(output.getvalue().encode('utf-8'))
        csv_data.seek(0)
        
        return csv_data
    
    def get_data(self):
        return {
            'my_anime_df': self.my_anime_df,
            'combined_anime_df': self.combined_anime_df,
            'combined_anime_embeddings_df': self.combined_anime_embeddings_df
        }