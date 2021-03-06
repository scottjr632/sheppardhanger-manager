from datetime import datetime

from docx import Document

import app.models.models as models
from app.definitions import ROOT_DIR


MASTER_CONTRACT = '{}/business/templates/master-contract.docx'.format(ROOT_DIR)

MONTH_STRS_ABRV = {
    1: 'JAN',
    2: 'FEB',
    3: 'MAR',
    4: 'APR',
    5: 'MAY',
    6: 'JUN',
    7: 'JULY',
    8: 'AUG',
    9: 'SEP',
    10: 'OCT',
    11: 'NOV',
    12: 'DEC'
}


def build_user_info(lessee: models.Lessee, reservation: models.Reservation) -> dict:
    """ builds dict from lessee model for use with master contract """
    today = datetime.today()

    return {
        '**DAY**': str(today.date),
        '**MONTH**': MONTH_STRS_ABRV[today.month],
        '**LESSEENAME**': '{}, {}'.format(lessee.lname, lessee.fname),
        '**LESSEECITY**': lessee.city,
        '**LESSEEADDRESS**' : lessee.address,
        '**LESSEESTATE**': lessee.state,
        '**LESSEEZIP**' : lessee.zipcode,
        '**LESSEEPHONE**': lessee.phone,
        '**LESSEEEMAIL**': lessee.email,
        '**STARTDAY**': str(reservation.checkindate),
        '**STARTMONTH**': '',
        '**ENDDAY**': str(reservation.checkoutdate),
        '**ENDMONTH**': ''
    }


def search_and_replace_master_contract(lessee_info: dict) -> Document:
    """ searches and replaces from key value dict. then saves new file """

    doc = Document(MASTER_CONTRACT)
    for para in doc.paragraphs:
        for key, value in lessee_info.items():
            if key in para.text:
                para.text = str(para.text).replace(key, value)

    return doc


def save_file(doc: Document, file_name: str):
    doc.save(file_name)
