import sys
import logging
import io

from flask import Blueprint
from flask import jsonify
from flask import request
from flask import make_response
from flask import send_file

from app import utils
import app.models.reservation_helpers as helpers
import app.models.house_helpers as house_helpers

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
    return jsonify([res.serialize() for res in helpers.get_res_by_lessee_filtered(lesseeid)])


@mod.route('/bookingtypes', methods=['GET'])
@utils.login_required
def get_booking_types(user):
    return jsonify([btype.serialize() for btype in helpers.get_all_bookingtypes()])


@mod.route('/bookingtypes', methods=['POST'])
def add_booking_type():
    data = request.get_json(force=True)
    try:
        btype = helpers.add_new_booking_type(data['name'])
        return jsonify(btype)
    except Exception as e:
        logging.error(e)
        return make_response('Unable to add new booking type')


@mod.route('/bookingtypes', methods=['PUT'])
def update_booking_type():
    data = request.get_json(force=True)
    try:
        helpers.update_booking_type(data['id'], data['name'])
        return make_response('Updated booking type!')
    except Exception as e:
        logging.error(e)
        return make_response('Unable to update booking type')


@mod.route('/bookingtypes/<bid>', methods=['DELETE'])
def delete_booking_type(bid):
    try:
        helpers.delete_booking_type(bid)
        return make_response('Deleted booking type!')
    except Exception as e:
        logging.error(e)
        return make_response('Unable to delete booking type')


@mod.route('/', methods=['POST'])
@utils.login_required
def new_reservation(user):
    data = request.get_json(force=True)
    try:
        reservation = helpers.new_reservation(data)
        return make_response(jsonify(reservation.serialize()), 200)
    except Exception as e:
        print(e, file=sys.stderr)
        return make_response('Something went wrong', 500)


@mod.route('/house-reservation', methods=['POST'])
def new_house_reservation():
    data = request.get_json(force=True)
    
    try:
        reservations = []
        rooms = house_helpers.get_rooms_by_house(data['houseid'])
        for room in rooms:
            reservation = helpers.new_reservation(data, roomid=room.id)
            reservations.append(reservation.serialize())
        return jsonify(reservations)
    except Exception as e:
        print(e, file=sys.stderr)
        return make_response('Something went wrong', 500)


@mod.route('/excel', methods=['GET'])
def get_calendar_as_excel():
    import app.business.xlsx as xlsx
    try:
        reservations = helpers.get_all_res_filtered()
        reservations = [reservation.serialize() for reservation in reservations]
        output = xlsx.create_calender_file(reservations)

        return send_file(
            io.BytesIO(output.read()),
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            attachment_filename='calendar-test.xlsx')
    except Exception as e:
        logging.error(e)
        return make_response('Unable to create excel backup', 500)
                

@mod.route('/', methods=['GET'])
@utils.login_required
def get_all_reservations(user):
    filtered = request.args.get('filter')
    try:
        reservations = None
        if filtered is not None and filtered == '0':
            reservations = helpers.get_all_res()
        else:
            reservations = helpers.get_all_res_filtered()
            
        print(reservations)
        return jsonify([reservation.serialize() for reservation in reservations])
    except Exception as e:
        print(e, file=sys.stderr)
        return make_response('Something went wrong', 500)


@mod.route('/status/<resid>/<status>')
@utils.login_required
def update_res_status(user, resid, status):
    try:
        helpers.set_res_archived_status(resid, status)
        return make_response('Updated reservation to {}'.format(status), 200)
    except Exception as e:
        return make_response(str(e), 500)


@mod.route('/<resid>', methods=['GET'])
@utils.login_required
def get_reservation_by_id(user, resid):
    res = helpers.get_res_by_id(resid)
    return jsonify(res.serialize())


@mod.route('/', methods=['PUT'])
@utils.login_required
def update_reservation(user):
    try:
        print('getting data')
        data = request.get_json(force=True)
        print(data)
        helpers.update_reservation(data)
        print('updated!!')
        return make_response('Updated reservation {}'.format(data['id']), 200)
    except Exception as e:
        print(e, file=sys.stderr)
        return make_response('Something went wrong', 500)


@mod.route('/<rid>', methods=['DELETE'])
@utils.login_required
def delete_reservations(user, rid):
    try:
        helpers.delete_reservation(rid)
        return make_response('Deleted reservation {}'.format(rid), 200)
    except Exception as e:
        print(e, file=sys.stderr)
        return make_response('Unable to delete reservarion', 500)
