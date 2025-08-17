from sentence_transformers import SentenceTransformer

class ModelService:
    _model = None
    
    @classmethod
    def initialize(cls):
        if cls._model is None:
            # Use a smaller, more memory-efficient model
            model_name = 'all-MiniLM-L6-v2'  # Much smaller than custom model
            cls._model = SentenceTransformer(model_name)
            print(f"Model {model_name} loaded successfully")
    
    @classmethod
    def get_model(cls):
        if cls._model is None:
            cls.initialize()
        return cls._model