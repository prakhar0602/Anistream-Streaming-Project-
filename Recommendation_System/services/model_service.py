from sentence_transformers import SentenceTransformer

class ModelService:
    _model = None
    
    @classmethod
    def initialize(cls):
        if cls._model is None:
            cls._model = SentenceTransformer('./sentence_transformer_model')
            print("Model loaded successfully")
    
    @classmethod
    def get_model(cls):
        if cls._model is None:
            cls.initialize()
        return cls._model