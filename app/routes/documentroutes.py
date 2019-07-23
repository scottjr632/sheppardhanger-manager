import logging

from flask import Blueprint
from flask import jsonify
from flask import request
from flask import make_response

import app.models.document_helpers as helpers
import app.utils as utils

mod = Blueprint('documentroutes', __name__)


# GET ROUTES

@mod.route('/', methods=['GET'])
@utils.login_required
def get_user_documents(user):
    try:
        docs = helpers.get_user_documents(user)
        return jsonify([doc.serialize() for doc in docs])
    except Exception as e:
        logging.error(e)
        return make_response('Unable to get documents', 500)


@mod.route('/<int:documentid>', methods=['GET'])
def get_document(documentid: int):
    try:
        doc = helpers.get_document(documentid)
        return jsonify(doc.serialize())
    except Exception as e:
        logging.error(e)
        return make_response('Unable to get documents', 500)


@mod.route('/resevation/<int:reservationid>', methods=['GET'])
def get_documents_for_reservation(reservationid: int):
    try:
        docs = helpers.get_documents_for_reservation(reservationid)
        return jsonify([doc.serialize() for doc in docs])
    except Exception as e:
        logging.error(e)
        return make_response('Unable to get documents', 500)


@mod.route('/lessee/<intlesseeid>', methods=['GET'])
def get_documents_for_lessee(lesseeid: int):
    try:
        docs = helpers.get_documents_for_lessee(lesseeid)
        return jsonify([doc.serialize() for doc in docs])
    except Exception as e:
        logging.error(e)
        return make_response('Unable to get documents', 500)


# POST ROUTES
@mod.route('/', methods=['POST'])
@utils.login_required
def new_document(user):
    data = request.get_json(force=True)
    data['userid'] = user

    try:
        doc = helpers.insert_new_documents(data)
        return jsonify(doc.serialize())

    except Exception as e:
        logging.error(e)
        return make_response('Unable to create docuemnt', 500)


# PUT ROUTES
@mod.route('/', methods=['PUT'])
def update_document():
    data = request.get_json(force=True)

    try:
        helpers.update_document(data)
        return make_response('updated document', 200)
    except Exception as e:
        logging.error(e)
        return  make_response('unable to update document', 500)


# DELETE ROUTES
@mod.route('/<int:documentid>', methods=['DELETE'])
def delete_document(documentid: int):
    try:
        helpers.delete_documents(documentid)
        return make_response('deleted document', 200)
    except Exception as e:
        logging.error(e)
        return make_response('unable to delete document', 500)
