from typing import List

import app.models.models as models
from app import db, utils


# GET FUNCTION

def get_user_documents(userid: int) -> List[models.Documents]:
    docs = models.Documents.query.filter_by(userid=userid)
    return docs


def get_documents(documents_id: int) -> models.Documents:
    return models.Documents.query.get(documents_id)


def get_documents_for_lessee(lessee_id: int) -> List[models.Documents]:
    docs = models.Documents.query.filter_by(lesseeid=lessee_id)
    return docs


def get_documents_for_reservation(reservation_id: int) -> List[models.Reservation]:
    docs = models.Documents.query.filter_by(reservationid=reservation_id)
    return docs


# POST FUNCTION

@utils.rollback_on_error
def insert_new_documents(data: dict) -> models.Documents:
    doc = models.Documents(**data)

    db.session.add(doc)
    db.session.commit()

    return doc


# PUT FUNCTIONS

@utils.rollback_on_error
def update_documents(data: dict):
    if not hasattr(data, 'id'):
        raise Exception('data object needs to contain documents id')

    doc = get_documents(data['id'])
    doc.update(**data)

    db.session.add(doc)
    db.session.commit()


# DELETE FUNCTION

@utils.rollback_on_error
def delete_documents(documents_id: int):
    doc = get_documents(documents_id)

    db.session.delete(doc)
    db.session.commit()
