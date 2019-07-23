import sys
import io
import base64
import logging

from flask import Blueprint
from flask import request
from flask import make_response
from flask import send_file
from flask.json import jsonify

from app import utils
import app.models.lessee_helpers as helpers
import app.models.reservation_helpers as reshelpers
from app.definitions import ROOT_DIR

mod = Blueprint('lesseeroutes', __name__)


@mod.route('/', methods=['POST'])
@utils.login_required
def new_lessee(user):
    data = request.get_json(force=True)
    try:
        lessee = helpers.add_new_lessee(data)
        return make_response(jsonify(lessee.serialize()), 200)
    except Exception as e:
        print(e, sys.stderr)
        return make_response('Something went wrong', 500)


@mod.route('/', methods=['GET'])
@utils.login_required
def get_all_lessees(user):
    filtered = request.args.get('filter')
    lessee = None
    if filtered is not None and filtered == '0':
        lessees = helpers.get_all_lessees()
    else:
        lessees = helpers.get_all_lessees_filtered()

    return jsonify([lessee.serialize() for lessee in lessees])


@mod.route('/', methods=['PUT'])
@utils.login_required
def update_lessee(user):
    try:
        data = request.get_json(force=True)
        helpers.update_lessee(data)
        return make_response('Updated reservations {}'.format(data['id']), 200)
    except Exception as e:
        print(e, file=sys.stderr)
        return make_response('Something went wrong', 500)


@mod.route('/<lid>', methods=['DELETE'])
@utils.login_required
def delete_lessee(user, lid):
    try:
        helpers.delete_lessee(lid)
        return make_response('Deleted lessee {}'.format(lid), 200)
    except Exception as e:
        print(e, file=sys.stderr)
        return make_response('Something went wrong', 500)


@mod.route('/<lid>', methods=['GET'])
@utils.login_required
def get_lessee_by_id(user, lid):
    lessee = helpers.get_lessee_info(lid)
    if lessee is not None:
        return jsonify(helpers.get_lessee_info(lid).serialize())
    else:
        return make_response('Cannot find lessee with id {}'.format(lid), 404)


@mod.route('/status/<lesseeid>/<status>')
@utils.login_required
def update_lessee_status(user, lesseeid, status):
    try:
        helpers.set_lessee_archived_status(lesseeid, status)
        return make_response('Updated lessee status to {}'.format(status), 200)
    except Exception as e:
        return make_response(str(e), 500)


@mod.route('/filter', methods=['GET'])
@utils.login_required
def get_lessee_by_filter(user):
    data = request.get_json(force=True)
    return helpers.get_lessee_by_email(**data)


@mod.route('/emails', methods=['GET'])
def get_lessee_emails():
    lessees = helpers.get_all_lessees()
    return jsonify([lessee.email for lessee in lessees])


@mod.route('/ranks', methods=['GET'])
def get_all_ranks():
    return jsonify([rank.serialize() for rank in  helpers.get_all_ranktype()])


@mod.route('/ranks', methods=['POST'])
def add_rank_type():
    data = request.get_json(force=True)
    try:
        new_rank = helpers.add_new_rank_type(data['name'])
        return jsonify(new_rank.serialize())
    except Exception as e:
        logging.error(e)
        return make_response('Unable to add new rank type')


@mod.route('/ranks', methods=['PUT'])
def update_ranks_type():
    data = request.get_json(force=True)
    try:
        helpers.update_rank_type(data['id'], data['name'])
        return make_response('Updated rank type!')
    except Exception as e:
        logging.error(e)
        return make_response('Unable to update rank type')


@mod.route('/ranks/<rid>', methods=['DELETE'])
def delete_ranks_type(rid):
    try:
        helpers.delete_rank_type(rid)
        return make_response('Deleted rank type!')
    except Exception as e:
        logging.error(e)
        return make_response('Unable to delete rank type')


@mod.route('/tdys', methods=['GET'])
def get_all_tdytypes():
    return jsonify([tdy.serialize() for tdy in helpers.get_all_tydtypes()])


@mod.route('/tdys', methods=['POST'])
def add_tdy_type():
    data = request.get_json(force=True)
    try:
        tdy = helpers.add_new_tdy_type(data['name'])
        return jsonify(tdy)
    except Exception as e:
        logging.error(e)
        return make_response('Unable to add new tdy type')


@mod.route('/tdys', methods=['PUT'])
def update_tdy_type():
    data = request.get_json(force=True)
    try:
        helpers.update_tdy_type(data['id'], data['name'])
        return make_response('Updated tdy type!')
    except Exception as e:
        logging.error(e)
        return make_response('Unable to update tdy type')


@mod.route('/tdys/<tid>', methods=['DELETE'])
def delete_tdy_type(tid):
    try:
        helpers.delete_tdy_type(tid)
        return make_response('Deleted tdy type!')
    except Exception as e:
        logging.error(e)
        return make_response('Unable to delete tdy type')


@mod.route('/guests', methods=['GET'])
def get_all_guesttypes():
    return jsonify([guest.serialize() for guest in helpers.get_all_guesttype()])


@mod.route('/guests', methods=['POST'])
def add_guest_type():
    data = request.get_json(force=True)
    try:
        guest = helpers.add_new_guest_type(data['name'])
        return jsonify(guest)
    except Exception as e:
        logging.error(e)
        return make_response('Unable to add new guest type')


@mod.route('/guests', methods=['PUT'])
def update_guest_type():
    data = request.get_json(force=True)
    try:
        helpers.update_guest_type(data['id'], data['name'])
        return make_response('Updated guest type!')
    except Exception as e:
        logging.error(e)
        return make_response('Unable to update guest type')


@mod.route('/guests/<tid>', methods=['DELETE'])
def delete_guest_type(tid):
    try:
        helpers.delete_guest_type(tid)
        return make_response('Deleted guest type!')
    except Exception as e:
        logging.error(e)
        return make_response('Unable to delete guest type')


@mod.route('/master-contract/<lid>/<rid>', methods=['GET'])
@utils.login_required
def get_master_contract(user, lid, rid):
    from app.business import build_user_info
    from app.business import search_and_replace_master_contract

    lessee = helpers.get_lessee_info(lid)
    reservation = reshelpers.get_res_by_id(rid)
    lessee_info = build_user_info(lessee, reservation)

    filename = '/Master Contract2 - {}, {}.docx'.format(lessee.lname, lessee.fname)
    document = search_and_replace_master_contract(lessee_info)
    bytesio = io.BytesIO()
    document.save(filename)
    # bytesio.seek(0)


    # base64.b64encode(bytestr)

    return send_file(filename, as_attachment=True ,attachment_filename=filename)
