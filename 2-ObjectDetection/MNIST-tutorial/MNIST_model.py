import os.path
import pickle


if __name__ == '__main__':
    if os.path.isfile('./model_weight.pkl'):
        W1, b1, W2, b2 = pickle.load('./model_weight.pkl')
    else:
        raise "Fichier non trouvé"