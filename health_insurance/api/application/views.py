from flask_restful import Resource
from flask import request, jsonify
from operator import itemgetter

# import db
from application import db

class PremiumPolicyActions(Resource):
    def getFloaterDiscount(self, ishighestAge):
        # This function return floater discount per individual
        if self.isFloaterDiscountApplicable and not ishighestAge:
            return 50
        return 0
    
    def post(self):
        '''
            This view is responsible for calculating the premium policy
        '''
        requestData = request.get_json(force=True)
        premiumdetails = []
        totalPrice = 0
        
        # sort members by age
        members = sorted(requestData['members'], key=itemgetter('age'), reverse=True)

        # check is floater discount applies if more than one member
        self.isFloaterDiscountApplicable = True if len(members) > 0 else False

        # Flag to ensure Floater discount applies to only hishest aged member
        ishighestAge = True

        # Lopp through the members and find base price and discounted price
        for member in members:
            reteData = db.premium_rate.find_one(
                {"sumInsured": int(member['sumInsured']), "age": int(member['age']), "tierID": int(member['cityTier']), "tenure": int(member['tenure'])}
            )
            baseRate = reteData['rate']
            floaterDiscount = self.getFloaterDiscount(ishighestAge)
            discount = baseRate * (floaterDiscount / 100)
            discountedRate = baseRate - discount
            premium = {
                "baseRate": baseRate,
                "floaterDiscount": floaterDiscount,
                "discountedRate": discountedRate,
                "age": member['age']
            }
            totalPrice += discountedRate
            premiumdetails.append(premium)
            
            # ishighestAge is true only for the first(highest age) member
            if ishighestAge:
                ishighestAge = False

        response = {
            "premium": premiumdetails,
            "totalPrice": totalPrice
        }
        return jsonify(response)
