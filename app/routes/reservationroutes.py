import sys

from flask import Blueprint
from flask import jsonify
from flask import request
from flask import make_response

from app import utils
import app.models.reservation_helpers as helpers

mod = Blueprint('reservationroutes', __name__)


@mod.route('/room/<roomid>', methods=['GET'])
@utils.login_required
def get_room_res_by_id(user, roomid):
    return jsonify([res.serialize() for res in helpers.get_res_by_room(roomid)])


@mod.route('/house/<houseid>', methods=['GET'])
@utils.login_required
def get_houses(user, houseid):
    return jsonify([res.serialize() for res in helpers.get_res_by_house(houseid)])


@mod.route('/lessee/<lesseeid>', methods=['GET'])
@utils.login_required
def get_res_by_lessee(user, lesseeid):
    return jsonify([res.serialize() for res in helpers.get_res_by_lessee(lesseeid)])


@mod.route('/bookingtypes', methods=['GET'])
@utils.login_required
def get_booking_types(user):
    return jsonify([btype.serialize() for btype in helpers.get_all_bookingtypes()])


@mod.route('/', methods=['POST'])
@utils.login_required
def new_reservation(user):
    data = request.get_json(force=True)
    try:
        helpers.new_reservation(data)
        return make_response('Added new reservation for {}'.format(data['lesseeid']), 200)
    except Exception as e:
        print(e, file=sys.stderr)
        return make_response('Something went wrong', 500)


@mod.route('/', methods=['GET'])
@utils.login_required
def get_all_reservations(user):
    try:
        reservations = helpers.get_all_res()
        return jsonify([reservation.serialize() for reservation in reservations])
    except Exception as e:
        print(e, file=sys.stderr)
        return make_response('Something went wrong', 500)


@mod.route('/', methods=['PUT'])
@utils.login_required
def update_reservation(user):
    try:
        data = request.get_json(force=True)
        helpers.update_reservation(data)
        return make_response('Updated reservation {}'.format(data['id']), 200)
    except Exception as e:
        print(e, file=sys.stderr)
        return make_response('Something went wrong', 500)
