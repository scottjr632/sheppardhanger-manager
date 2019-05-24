import sys

from flask import Blueprint
from flask import request
from flask import make_response
from flask.json import jsonify

from app import utils
import app.models.lessee_helpers as helpers

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


@mod.route('/ranks', methods=['GET'])
def get_all_ranks():
    return jsonify([rank.serialize() for rank in  helpers.get_all_ranktype()])


@mod.route('/tdys', methods=['GET'])
def get_all_tdytypes():
    return jsonify([tdy.serialize() for tdy in helpers.get_all_tydtypes()])


@mod.route('/guests', methods=['GET'])
def get_all_guesttypes():
    return jsonify([guest.serialize() for guest in helpers.get_all_guesttype()])
