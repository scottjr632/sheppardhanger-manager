import sys

from flask import Blueprint
from flask import request
from flask import make_response

from app import utils
import app.models.lessee_helpers as helpers

mod = Blueprint('lesseeroutes', __name__)


@mod.route('/', methods=['POST'])
@utils.login_required
def new_lessee(user):
    data = request.get_json(force=True)
    try:
        helpers.add_new_lessee(data)
        return make_response('Added new lessee {}'.format(data.email), 200)
    except Exception as e:
        print(e, sys.stderr)
        return make_response('Something went wrong', 500)
