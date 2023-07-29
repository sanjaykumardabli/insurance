from application import app
from flask_restful import Api

from .views import PremiumPolicyActions

api = Api(app)

api.add_resource(PremiumPolicyActions, '/calculate_premium')
