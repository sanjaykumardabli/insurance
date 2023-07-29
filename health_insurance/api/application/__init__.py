from flask import Flask
from flask_pymongo import PyMongo
import pymongo, certifi
import configparser, os
from flask_cors import CORS

config = configparser.RawConfigParser()
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
config_file = os.path.join(BASE_DIR, '../api/config')
config.read(config_file)

app = Flask(__name__)
app.config['SECRET_KEY'] = config['default_db']['USERNAME']
cors = CORS(app)

mongo_client = pymongo.MongoClient(f"mongodb+srv://{config['default_db']['USERNAME']}:{config['default_db']['PASSWORD']}@cluster0.ymuiv1k.mongodb.net/?retryWrites=true&w=majority", 27017, tlsCAFile=certifi.where())
db = mongo_client.db

from application import routes
