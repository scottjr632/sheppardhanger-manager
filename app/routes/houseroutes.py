from flask import Blueprint
from flask import jsonify
from flask import request

import app.models.house_helpers as house_helper
import app.utils as utils


mod = Blueprint('houseroutes', __name__)


@mod.route('/', methods=['GET'])
@utils.login_required
def get_houses(user):
    houses = house_helper.get_all_houses()
    return jsonify([house.serialize() for house in houses])


@mod.route('/rooms', methods=['GET'])
@utils.login_required
def get_rooms(user):
    
    rooms = house_helper.get_all_rooms()
    return jsonify([room.serialize() for room in rooms])
